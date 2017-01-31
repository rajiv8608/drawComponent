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

    async add(tool: Tool, options?: fabric.IObjectOptions) {
        this.tool = tool;
        let shape;
        let drawTool = this._tools.getToolAction(tool.id) as any;
        if (tool.id === 'tool__image') {
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

    update(props: any, tool: string) {
        this.current = this.canvas.getActiveObject();
        forEach(props as {}, (value, name) => {
            console.log(`updating ${name}:${value}`);
            this.current.set(name, value);
        });

        this.current.set(name, tool);
        this.saveState()
    }

    remove() {
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

    save() {
        if (this.canvas) {
            let source = this.canvas.toSVG(null);
            let blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
            let svgUrl = URL.createObjectURL(blob);
            let downloadLink = document.createElement('a');
            downloadLink.href = svgUrl;
            downloadLink.download = 'newesttree.svg';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            this.saveState();
        }
    };

    saveState() {
        let json = this.canvas.toDatalessJSON();
        console.info('caching: ', json);
        this._cache.insert('lastSession', json);
    }
}
