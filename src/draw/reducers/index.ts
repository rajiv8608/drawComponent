declare var angular: any;

import * as _fabric from 'fabric';
let fabric = (_fabric as any).fabric as typeof _fabric;

import { Storage } from '@microsoft/office-js-helpers';
import { DrawModule } from '../module';
import { loadFile, saveFile, confirm } from '../core';
import { Tool } from '../models';
import { DrawToolsService } from '../tools';
import forEach = require('lodash/forEach');


export class DrawStateService {
    constructor(private $q: angular.IQService, private _tools: DrawToolsService, private _timeout: angular.ITimeoutService) { }
    canvas: fabric.Canvas = null;
    tool: Tool;
    current: fabric.Object;
    uniqueId: string;
    private _cache:any;
    disableResize = false;
    propertiesData:any;
    activeId: number;
    canvasWidth :any;
    canvasHeight:any;
    clipboard = null;   
    copiedObject = null;
    toolId :any;
    toolName : any;
    copiedObjects = [];
    copyObj:any;
    newCanvasHeightWidth:any= { Width: 0, Height: 0 };
    init(canvas$: HTMLCanvasElement) {
        this._cache = new Storage('draw_tool_cache'+this.uniqueId);
        this.canvas = new fabric.Canvas(canvas$);
        //console.log("id="+this.uniqueId);
        if (this._cache.contains('lastSession'+ this.uniqueId)) {
            let data = this._cache.get('lastSession'+ this.uniqueId);
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
        else if (tool.id === 'tool__rescale') {
            this.disableResize = false;
            let result = window.prompt('Enter width and height in wxh format');
            if (result == null) {
                return;
            }
            let [width, height] = result.toLowerCase().split('x');
            this.rescale(+width, +height);
            this.disableResize = true;
            return;
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
        else if (tool.id === 'tool__svg' 
            || tool.id === 'tool__wheel' 
            || tool.id === 'tool__arrowdown' || tool.id === 'tool__arrowcircle') {
            try {
                shape = await drawTool({ ...options, name: tool.id });
                this.canvas.add(shape).renderAll();
                this.canvas.setActiveObject(shape);
                this.current = shape;
                this.saveState();
                return shape;
            }
            catch (e) {
                console.error(e);
                return;
            }
        }
        else if(tool.id === 'tool_icon') {
            options.height = 50; options.width = 50;
            shape = drawTool({ ...options, name: tool.id });
        }
        else {
            shape = drawTool({ ...options, name: tool.id });
            this.canvas.add(shape);
            this.canvas.setActiveObject(shape);
            this.current = shape;
            this.saveState();
            this.canvas.renderAll();
            return shape;
        }        
    }

     update(props: any) {
        /* FIXED
         * BUG: Some controls grow/disappear when properties such as strokeWidth,
         * scale or radius etc are updated. Upon refreshing they are available.
         */  
        //console.log(this.current);                     
       // this.current = this.canvas.getActiveObject();
            if(this.current) {
                forEach(props as {}, (value: any, name) => {
                    if (name === 'strokeDashArray' && value && value.length) {
                        let valueArr = value.split(',');
                        props[name] = valueArr;                   
                    }
                    else if(!isNaN(Number(value)) && value !== "") {
                        props[name] = Number(value);
                    }
                }); 
                this.current.setOptions(props);
                if(this.current.name === "tool__svg"){                
                    for (var i = 0; i < this.current.get("paths").length; i++) {
                        let item = this.current.get("paths")[i];
                        if(item.get("fill") !== "#FFFFFF" && item.get("fill") !== "none" && item.get("fill")!== ""){
                            if(props.fill !== '') {
                                item.setFill(props.fill);
                            }
                        }                
                    }               
                }
                
                this.saveState();            
                this.canvas.renderAll();            
                this.propertiesData = props;
            }          
    }

    remove() {
        /*
         * BUG: Sometimes objects dont get removed -- FIXED
         */
        if(this.canvas) {
            //this.current.remove();                     
            if(this.canvas.getActiveGroup()) {
                let o = this.canvas.getActiveGroup();               
                o.getObjects().forEach((object, key) => {
                    this.canvas.remove(object);
                    o.removeWithUpdate(object);
                });
                this.canvas.discardActiveGroup();
            }
            else
            this.canvas.getActiveObject().remove();
            this.current = null;
            this.saveState();  
            this.canvas.renderAll();
        }       
    }

    bringToFront() {
        if(this.current) {
            return this.current.bringToFront();
        }
    }

    sendToBack() {
         if(this.current) {
            return this.current.sendToBack();
        }       
    }
    isWidthChanged(width,height){     
        if(this.current){
            this.newCanvasHeightWidth = { Width: width, Height: height };
        }      
    }
    getWidthHeight (){           
        return this.newCanvasHeightWidth;       
    }

    rescale(width, height) {
        if (this.disableResize) {
            return;
        }
        this.canvas.setWidth(width - 373 /* container - tools - properties - borders */);
        this.canvas.setHeight(height - 1 /* borders */);
        this.canvas.renderAll();
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

    loadSVG(type: string) {       
        if (this.canvas) { 
            let data = '';          
            switch(type){
                case 'tool__arrowdown':
                    data = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 128 128" style="enable-background:new 0 0 128 128;" xml:space="preserve"><style type="text/css">	.st0{fill:#A4A6A9;}</style><path class="st0" d="M124,17.2c-0.5,0-1-0.1-1.5-0.1c-1.4-0.2-2.8-0.4-4.2-0.4c-1,0-2.1-0.1-3.1-0.2c-1.1,0-2.4,0-3.6-0.1  c-2.6,0-5.5,0.1-8.7,0.4c-1.6,0.1-3.2,0.4-5,0.5c-1.8,0.2-3.6,0.5-5.4,0.9c-3.8,0.7-7.6,1.7-11.3,2.9c-4,1.3-7.9,2.8-11.7,4.6  c-4,1.9-7.8,3.9-11.6,6.2c-3.7,2.4-7.3,4.9-10.7,7.7c-3.3,2.8-6.5,5.7-9.5,8.8c-2.8,3-5.4,6.1-7.9,9.3c-1.2,1.5-2.2,3-3.2,4.6  c-1,1.5-2,3-2.9,4.5c-0.9,1.5-1.6,2.9-2.4,4.2c-0.7,1.4-1.4,2.7-2,4c-0.6,1.2-1.1,2.5-1.6,3.6c-0.5,1.1-0.9,2.1-1.2,3.1  c-0.7,1.9-1.2,3.4-1.6,4.4c-0.2,0.5-0.4,1.1-0.5,1.6l18.3,4.7c0,0,0.1-0.5,0.2-1.4c0.2-1.3,0.5-2.5,0.9-3.7c0.2-0.9,0.4-1.7,0.6-2.7  s0.6-2,1-3.1c0.4-1.1,0.7-2.2,1.2-3.5c0.5-1.2,1-2.5,1.5-3.9L40,70c0.7-1.4,1.4-2.9,2.2-4.4c1.7-3.1,3.6-6.1,5.6-9  c2.2-3.1,4.6-6,7.2-8.8c2.7-2.9,5.6-5.6,8.6-8.2c3.1-2.6,6.3-5,9.7-7.1c3.4-2.1,6.9-4,10.2-5.7c3.3-1.6,6.7-3,10.2-4.2  c1.6-0.6,3.4-1,5-1.5c1.6-0.5,3.2-0.9,4.7-1.2c3-0.7,5.9-1.1,8.3-1.5c1.2-0.1,2.5-0.2,3.5-0.4c1-0.1,2.1-0.1,3-0.2  c1.9-0.1,3.2-0.1,4.2-0.2C123.1,17.3,123.5,17.2,124,17.2"/><polygon class="st0" points="2,83.5 46,90.9 20.2,109.1 "/></svg>';
                    break;
                case 'tool__arrowcircle':
                    data = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 256 256" style="enable-background:new 0 0 256 256;" xml:space="preserve"><style type="text/css">	.st0{fill:#F58220;}	.st1{fill:#FFFFFF;}</style><path class="st0" d="M238.5,133c0,62.4-50.6,113-113,113s-113-50.6-113-113s50.6-113,113-113C187.9,20,238.5,70.6,238.5,133  L238.5,133"/><path class="st0" d="M118.3,138.2c0.2,0.4,0,0.8-0.4,1c-0.1,0-0.2,0.1-0.2,0.1c-0.5,0.1-0.9-0.1-1.1-0.6l0,0  c-0.1-0.5,0.2-0.9,0.6-1.1C117.7,137.6,118.2,137.8,118.3,138.2z"/><path class="st0" d="M134.1,133.2c0.1,0.5-0.1,1-0.6,1.1c-0.4,0.2-0.9-0.1-1.1-0.5c0,0,0,0,0,0v-0.1c-0.1-0.5,0.2-0.9,0.7-1  C133.6,132.5,134,132.8,134.1,133.2L134.1,133.2z"/><path class="st0" d="M129,134.8c0.2,0.5,0,1-0.5,1.2c-0.5,0.2-1,0-1.2-0.5c0-0.1,0-0.1,0-0.2c-0.2-0.5,0.1-0.9,0.5-1.1c0,0,0,0,0,0  h0C128.4,134.1,128.8,134.3,129,134.8z"/><path class="st0" d="M136.6,132.4c0.1,0.5-0.2,0.9-0.6,1.1c-0.5,0.1-0.9-0.2-1-0.7c-0.1-0.4,0.1-0.8,0.5-1  C136,131.6,136.4,131.9,136.6,132.4L136.6,132.4z"/><path class="st1" d="M132.8,173c-12,1.3-22.3-2.1-32.2-8.3c1.3-1.1,2.4-2.1,3.9-3.4c-6.1-0.5-11.8-1-17.6-1.5  c-1,5.7-1.9,11.2-2.9,17.2c1.5-1.5,2.9-2.6,4.2-3.9c13.4,12.6,29,18,47.2,14.7c-2.8-2.4-5.5-5-8.3-7.4  C129.1,177.7,130.9,175.5,132.8,173z"/><path class="st1" d="M161.9,145.4c-1,5.7-3.7,11-7.8,15.2c-3.8,4.3-8.4,7.8-13.6,10.4c-0.2-1.3-0.3-2.4-0.5-4  c-3.2,4.5-6.3,8.9-9.5,13.4c3.9,3.7,7.6,7.3,11.3,10.7c0.1-0.9,0.1-1.7,0-2.6c-0.3-1.6,0.3-2.1,1.6-2.4c11.6-4.3,21.4-12.4,27.8-23  c2.2-3.3,3.8-7,4.7-10.8c-3.1,1.1-5.8,2.1-8.6,3.1C165.7,152,163.9,148.8,161.9,145.4z"/><path class="st1" d="M151.4,109.1c9.7,7.6,13.1,23.6,12,30.1c-0.8-0.2-1.5-0.5-2.6-0.8c2.9,4.9,5.7,9.4,8.4,13.9  c4.4-1.6,8.6-3.2,13.1-4.9c-1.2-0.6-2.4-1.1-3.7-1.5c-0.6-0.1-1-0.7-0.9-1.3v-0.2c0.3-2.6,0.8-5.2,1-7.8c0.6-11-2.4-21.8-8.6-30.9  c-1.6-2.3-3.4-4.4-5.3-6.5c-0.2,0-0.3,0.2-0.5,0.3c-0.2,2.1-0.5,4.4-0.6,6.6c0,1.1-0.5,1.6-1.6,1.6  C158.7,108.2,155.1,108.6,151.4,109.1z"/><path class="st1" d="M91.7,121.4c4.5-9.3,11.9-16.9,21-21.7c0.8,1.8,1.5,3.4,2.3,5.2c2.8-5.3,5.5-10.5,8.3-16  c-5.2-3.1-10.2-6-15.2-8.9c-0.1,0.1-0.1,0.2-0.2,0.3c0.5,1.6,1,3.1,1.5,4.7c-15.4,6.1-26.7,16-32.7,31.6c3.6-1.5,7.1-3.1,10.7-4.5  C89,115.3,90.2,118.3,91.7,121.4z"/><path class="st1" d="M95.1,158.3c-6.2-8.7-8.7-19.5-7-30.1c1.8,0.6,3.2,1.1,5,1.6c-2.4-5.2-4.7-10-7-15c-5.7,2.4-11,4.9-16.8,7.3  c1.8,0.5,3.4,1,5,1.3c-1.9,7.5-2,15.3-0.5,22.8c1.2,7.7,4.3,15,8.9,21.4c0.6-3.6,1.1-6.8,1.6-9.9C88,157.7,91.4,158,95.1,158.3z"/><path class="st1" d="M121.3,98.1c4.4,0.5,8.7,0.6,12.9,1.5c4.3,0.9,8.4,2.7,12,5.2c-1,1-1.8,1.6-3.1,2.8c6.3-0.6,12.1-1.1,18-1.8  c0.5-4.4,0.8-8.6,1.3-13.1c-1.1,1-2.1,1.6-2.9,2.3c-11.4-9.1-26-13.2-40.5-11.2c2.4,1.9,4.7,3.6,6.8,5.3  C124.4,92.1,122.8,95.4,121.3,98.1z"/></svg>';                    
                    break;
                case 'tool__wheel':
                    data = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 256 256" style="enable-background:new 0 0 256 256;" xml:space="preserve"><style type="text/css">	.st0{fill:none;stroke:#808285;stroke-width:1.04;stroke-miterlimit:10;stroke-dasharray:2.07,2.07;}	.st1{fill:none;stroke:#A7A9AC;stroke-miterlimit:10;stroke-dasharray:1.99,1.99;}	.st2{fill:#0093D0;}	.st3{fill:#FFFFFF;}</style><circle class="st0" cx="127.6" cy="128.4" r="89.6"/><line class="st1" x1="128" y1="40.8" x2="128" y2="214.6"/><line class="st1" x1="181.6" y1="59.2" x2="74.4" y2="196.2"/><line class="st1" x1="211.5" y1="103.4" x2="44.5" y2="152"/><line class="st1" x1="210.1" y1="156.2" x2="45.9" y2="99.2"/><line class="st1" x1="176" y1="200.2" x2="80" y2="55.2"/><path class="st2" d="M154.5,124.6c-1.2-5-5.7-8.5-10.9-8.5h-0.1c0-6.2-5-11.2-11.2-11.2c-4.1,0-7.9,2.3-9.9,5.9  c-1.1-0.4-2.3-0.7-3.5-0.7c-5.8,0-10.5,4.7-10.5,10.5l0,0v0.1c-0.5-0.1-0.9-0.1-1.4-0.1c-6.6,0-11.9,5.3-11.9,11.9  c0,6.6,5.3,11.9,11.9,11.9c0,0,0,0,0,0h43.7c5.7,0,10.3-4.6,10.3-10.3l0,0C160.9,129.9,158.4,126.2,154.5,124.6"/><path class="st3" d="M210.9,101.2c0.1-0.2,0.1-0.4,0.3-0.6c0.2-0.2,0.5-0.2,0.7-0.1c0.1,0,0.1,0.1,0.1,0.2c0.1,0.3,0.2,0.6,0.1,0.9  c-0.1,0.3-0.3,0.4-0.6,0.4c-0.2,0-0.4-0.3-0.4-0.6C211,101.4,211,101.3,210.9,101.2L210.9,101.2z"/></svg>';
                    break;
            } 
        
            fabric.loadSVGFromString(data, (objects, options) => {
                let obj = fabric.util.groupSVGElements(objects, options);
                this.canvas.setActiveObject(obj);
                this.current = obj;
                this.canvas.add(obj).renderAll();
                this.saveState();
            });
        }       
    }

    loadFabricJSON(jsonData: any) {        
        if (this.canvas) {
            this.canvas.loadFromJSON(jsonData, null);
            // forEach(jsonData.objects as {}, (item: any, name) => {          
            //     if (item.type === 'text' && item.fontFamily !== 'Segoe UI') {
            //        this.draw({
            //             id: 'tool__icon'
            //         }, item);
            //     }
            //     else if(item.type === 'path-group')
            //         this.draw({
            //             id: 'tool__svg'
            //         }, item);
            //     else
            //         this.draw({
            //             id: 'tool__' +item.type
            //         }, item);
                    
            // });
            this.saveState();            
        }    
    }

    async clear() {
        try {
            let result = await confirm('Are you sure you want to delete the current project?');
            if (result) {
                this._cache.clear();
                this.canvas.clear();
            }
        }
        catch (e) {
            console.error(e);
        }
    }

    clearCache(result) {
        try {           
            if (result) {
                this._cache.clear();
            }
        }
        catch (e) {
            console.error(e);
        }
    }

    clearCanvas(result) {
        try {           
            if (result) {
                this.canvas.clear();
            }
        }
        catch (e) {
            console.error(e);
        }
    }

    save() {
        let json = this.saveState();
        if (json == null) { return; }
        let blob = new Blob([JSON.stringify(json)], { type: 'application/json;charset=utf-8' });
        saveFile(blob, 'new_project.json');
    }

    async open() {
        await new Promise(async (resolve) => {
            let result = await loadFile();
            if (result == null) { return; }
            this.canvas.loadFromJSON(result, e => {
                this.canvas.renderAll();
                resolve(e);
            });
        });;
    }

    dataURItoBlob(dataURI) {
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs -
        var byteString = atob(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

        // write the bytes of the string to an ArrayBuffer
        var ab = new ArrayBuffer(byteString.length);

        // create a view into the buffer
        var ia = new Uint8Array(ab);

        // set the bytes of the buffer to the correct values
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        // write the ArrayBuffer to a blob, and you're done
        var blob = new Blob([ab], {type: mimeString});
        return blob;

    }

    download() {
        if (this.canvas == null) { return; }
        let source = this.canvas.toDataURL({format: 'png'});
        let blob = this.dataURItoBlob(source);
        saveFile(blob, 'new_project.png');
    }
    
    getSVGBlob(filename) {
        if (this.canvas == null) { return; }
        let source = this.canvas.toSVG(null,function(svg) {
            console.log(svg);
            //return svg.replace();
            return svg;
        });
        let blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
        //saveFile(blob, 'new_project.svg');
        return blob;
    }

    constructURL() {
        if (this.canvas == null) { return; }
        let source = this.canvas.toDataURL({format: 'png'});
        let blob = this.dataURItoBlob(source);
        let url = URL.createObjectURL(blob);
        return url;
    }

    getFile(filename) {
        if (this.canvas == null) { return; }        
        let source = this.canvas.toDataURL({format: 'png', multiplier: 1.2 });
        let blob = this.dataURItoBlob(source);    
        let file = new File([blob], filename, {type: 'image/png', lastModified: Date.now()});
        return file;
    }

    getBlob(filename) {
        if (this.canvas == null) { return; }        
        let source = this.canvas.toDataURL({format: 'png', multiplier: 2});
        let blob = this.dataURItoBlob(source);   // var blob = new Blob([blobContent], {type : 'image/jpeg'});
        return blob;

      /*   if (this.canvas == null) { return; }        
            let source = this.canvas.toDataURL({format: 'png', multiplier: 2});        
            let blob = new Blob([source], { type: 'image/png' });        
            saveFile(blob, 'new_project.png');  */
    }   
    onPaste() { 
        var that = this;
        // if(that.copiedObjects.length > 1){          
        //     for(var i in that.copiedObjects){
        //         var cloneobj = that.copiedObjects[i].clone();
        //         cloneobj.set({
        //             left: 0,
        //             top: 0                   
        //         });
        //         that.canvas.add(cloneobj);            
        //     }                
        // }       
    // if(that.canvas.getActiveGroup()){
    //       let group = that.canvas.getActiveGroup();     
    //       that.canvas.discardActiveObject();   
    //       group.forEachObject(obj => {
    //         obj = fabric.util.object.clone(obj); 
    //         let copyItem = Object.assign({}, obj,  { top:group.top + 10, left: group.left + 10});
    //         that.canvas.add(copyItem);
    //         that.canvas.renderAll();  
             // this.draw({ id: copyItem.name || "tool__"+copyItem.type }, copyItem); 
    //      });
    //   }
        if (that.clipboard) {
                that.clipboard.clone(function(clonedGroup){
                    that.clipboard = clonedGroup;  
                    that.canvas.discardActiveGroup();
                    that.clipboard.set({
                    left: that.clipboard.left+10,
                    top: that.clipboard.top+10,
                    evented: true
                });         
                that.clipboard.forEachObject(function(obj ,key ){              
                    that.copiedObjects.forEach((value , key2)=>{
                         if(key == key2){
                            obj.id = value.toodId;
                            obj.name = value.toolName;
                         }
                    });                
                    obj.set('active', true);
                    that.canvas.add(obj);
                });
                that.canvas.setActiveGroup(that.clipboard).renderAll();
            });              
        } 
        else{            
            that.copiedObject.clone(function(clonedObj){
                that.canvas.discardActiveObject();
                clonedObj.set({
                    left: clonedObj.left + 10,
                    top: clonedObj.top + 10,
                    evented: true,
                });  
                if(clonedObj.type == 'i-text'){
                    clonedObj.type = 'text';                    
                }
                if(that.toolId){
                    clonedObj.id = that.toolId;
                }
                if(that.toolName){
                    clonedObj.name = that.toolName;
                }
                that.canvas.add(clonedObj);  
                that.canvas.setActiveObject(clonedObj);
                that.canvas.renderAll();                                    
            })
          
        }     
    }
     onCopy(){       
         var that = this;   
         that.clipboard = null;  
         that.copiedObject = null; 
         that.copiedObjects = [];  
        //  if(that.canvas.getActiveGroup()){            
            //    let objects = that.canvas.getActiveGroup().getObjects();
            //    objects.forEach(function(object){
            //         object.clone(function(cloned){
            //         that.copiedObjects.push(cloned);
            //       })                
            //    }); 
        if(that.canvas.getActiveGroup()) {
            let objects = that.canvas.getActiveGroup().getObjects();
            objects.forEach((object,key)=>{
                that.copiedObjects.push({toodId : object['id'], toolName: object['name']})
            })
            that.canvas.getActiveGroup().clone(function(cloneGroup) {
                that.clipboard = cloneGroup;
            });          
        }            
        else{
            var current = that.canvas.getActiveObject();
            that.toolId = current['id'];
            that.toolName = current['name'];           
            that.canvas.getActiveObject().clone(function(cloned) {
                that.copiedObject = cloned;
            }); 
        }           
    } 

    saveState() {
        let json = this.canvas.toDatalessJSON(["id", "name"]);       
        return this._cache.insert('lastSession'+ this.uniqueId, json );
    }   

    getPropertiesCtrl() {
         return this.propertiesData;
    }

    rotate(angle: number){
        this.current = this.canvas.getActiveObject();
        if(this.current) { 
            this.current.rotate(this.current.get('angle') + angle);
            this.canvas.renderAll();
        }
    }
}
