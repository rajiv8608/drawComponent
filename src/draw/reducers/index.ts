import * as angular from 'angular';
import * as _fabric from 'fabric';
let fabric = (_fabric as any).fabric as typeof _fabric;

import { Storage } from '@microsoft/office-js-helpers';
import { DrawModule } from '../module';
import { Tool } from '../models';
import { DrawToolsService } from '../tools';
import forEach = require('lodash/forEach');

export class DrawStateService {
    constructor(private $q: angular.IQService, private _tools: DrawToolsService) { }
    canvas: fabric.Canvas = null;
    tool: Tool;
    current: fabric.Object;
    private _cache = new Storage('draw_tool_cache');

    init(canvas$: HTMLCanvasElement) {
        this.canvas = new fabric.Canvas(canvas$);
        if (this._cache.contains('lastSession')) {
            let data = this._cache.get('lastSession');
            this.canvas.loadFromJSON(data, () => { });
        }
    }

    async draw(tool: Tool, options?: fabric.IObjectOptions) {
        this.tool = tool;
        let shape;
        let drawTool = this._tools.getToolAction(tool.id) as any;
        if (tool.id === 'tool__download') {
            return this.download();
        }
        else if (tool.id === 'tool__image') {
            try {
                shape = await drawTool({ ...options, name: tool.id });
            }
            catch (e) {
                console.error(e);
                return;
            }
        }
        else {
            shape = drawTool({ ...options, name: tool.id });
        }
        this.canvas.add(shape);
        this.canvas.setActiveObject(shape);
        this.current = shape;
        this.saveState()
        return shape;
    }

    update(props: any) {
        this.current = this.canvas.getActiveObject();
        forEach(props as {}, (value, name) => {
            this.current.set(name, value);
        });
        this.saveState();
    }

    remove() {
        // Bug with groups
        this.current.remove();
    }

    bringToFront() {
        return this.current.bringToFront();
    }

    sendToBack() {
        return this.current.sendToBack();
    }

    rescale(width, height) {
        this.canvas.setWidth(width - 373 /* container - tools - properties - borders */);
        this.canvas.setHeight(height - 1 /* borders */);
    }

    loadFabricSVG() {
        let deferred = this.$q.defer();
        if (this.canvas) {
            let url = window.prompt('URL', 'Enter the editor svg url');
            if (/^https?/i.test(url)) {
                fabric.loadSVGFromURL(url, (objects, options) => {
                    let obj = fabric.util.groupSVGElements(objects, options);
                    this.canvas.add(obj).renderAll();
                    deferred.resolve(true);
                    this.saveState()
                });
            }
            else {
                fabric.loadSVGFromString(url, (objects, options) => {
                    let obj = fabric.util.groupSVGElements(objects, options);
                    this.canvas.add(obj).renderAll();
                    deferred.resolve(true);
                    this.saveState()
                });
            }
        }
        else {
            deferred.reject(false);
        }
        return deferred.promise;
    }

    clear() {
        this._cache.clear();
        this.canvas.clear();
    }

    save() {
        let json = this.saveState();
        if (json == null) { return; }
        let blob = new Blob([JSON.stringify(json)], { type: 'application/json;charset=utf-8' });
        this._saveFile(blob, 'new_project.json');
    }

    async open() {
        await new Promise(async (resolve) => {
            let result = await this._loadFile();
            if (result == null) { return; }
            this.canvas.loadFromJSON(result, e => {
                resolve(e);
            });
        });;
    }

    download() {
        if (this.canvas == null) { return; }
        let source = this.canvas.toSVG(null);
        let blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
        this._saveFile(blob, 'new_project.svg');
    }

    saveState() {
        let json = this.canvas.toDatalessJSON();
        console.info('caching: ', json);
        return this._cache.insert('lastSession', json);
    }

    private _saveFile(blob: Blob, name: string) {
        let url = URL.createObjectURL(blob);
        let downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = name;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        this.saveState();
    };

    private async _loadFile() {
        let fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);
        fileInput.click();
        let promise = new Promise<string>((resolve, reject) => {
            fileInput.onchange = (e: any) => {
                try {
                    let file = e.target.files[0];
                    if (file == null) {
                        return;
                    }
                    let reader = new FileReader();
                    reader.onload = (e: any) => {
                        try {
                            let contents = e.target.result;
                            resolve(contents && contents.trim());
                        }
                        catch (e) {
                            reject(e);
                        }
                    };
                    reader.onerror = (e: any) => {
                        reject(e);
                    }
                    reader.readAsText(file);
                }
                catch (e) {
                    reject(e);
                }
            };
        });

        let result: string = null;
        try {
            result = await promise;
        }
        catch (e) {
            console.info('Unable to load file:', e);
        }
        finally {
            document.body.removeChild(fileInput);
            return result;
        }
    }
}
