declare var angular: any;
import * as _fabric from 'fabric';
let fabric = (_fabric as any).fabric as typeof _fabric;

import * as $ from 'jquery';
import { DrawModule } from './module';
import { DrawError } from './core';
import { DrawStateService } from './reducers';
import { DrawToolsService, Tool } from './tools';
import debounce = require('lodash/debounce');
import './styles/draw.scss';

export class DrawController {
    tools: Tool[];
    id: string;
    width: number;
    height: number;
    properties: any;
    showAdvance:any;
    showGeneral:any;
    propertiesState:any;
    currentTool: any;
    defaultIconItem:any;
    currentTarget:any;
    canvasBoundaries:any;
    currentCanvas:any;
    calcOffset:any; 
    currentObj:any;    
    copiedObjects = [];
    public defaultCanvasWidth:any;
    public defaultCanvasHeight:any;    
    constructor(
        private _scope: any,
        private _tools: DrawToolsService,
        public state: DrawStateService,
        private _attrs: angular.IAttributes,
        public  canvasWidth:any,  
        public canvasHeight:any,    
    ) {
        this.showGeneral = true;
        this.tools = [...this._tools.defaultTools, {
            icon: 'Download',
            id: 'tool__download',
            name: 'Export to SVG',
            placeholderName: 'Export to SVG'
            
        }, {
            icon: 'FullScreen',
            id: 'tool__rescale',
            name: 'Resize',
            placeholderName: 'Resize'
        }];       
    }         
    subscribeToEvents() {            
        const _update = () => {
            let obj = this.state.canvas.getActiveObject();          
            if (obj == null) {
                obj = this.state.canvas.getActiveGroup();
            }
            if (obj == null) {
                return null;
            }
            let {name, type} = obj;
            return this._tools.getProperties(obj, name || `tool__${type}`);
        }    
        this.state.canvas.on('object:selected', (event) => this._scope.$applyAsync(() => {
            //console.log(event);            
            // var id = this.state.canvas.getObjects().indexOf(event.target);
            // this.state.activeId = id;
            // var num = this.state.canvas.item(id);console.log(id, num);                     
            this.properties = _update();           
            this.state.current = this.state.canvas.getActiveObject(); 
                
            // if(this.state.current.name === "tool__text") {
                 this._scope.Draw.events({data: 'selected'});
            // }
            // else {
            //     this._scope.Draw.events({data: false});    
            // }
            // console.log(this.properties, this.state.canvas.getActiveObject(), event);
            this.state.saveState();
            /*
             * BUG: Apply doesn't trigger change detection.
             * `properties` is initializated but doesnt show up on the UI
             */
        }));

        this.state.canvas.on('object:modified', () => this._scope.$applyAsync(() => {  
            this.state.saveState();
            this.state.current = this.state.canvas.getActiveObject();                      
            this.properties = _update();
            this._scope.Draw.events({data: 'modified'});
            //this.state.current = this.state.canvas.getActiveObject();
            // if(this.state.current.name === "tool__text") {
            //     this._scope.Draw.events({data: this.properties});
            // }
            // else {
            //     this._scope.Draw.events({data: false});    
            // }
            // console.log(this.properties);
            //this.state.saveState();
        }));

        this.state.canvas.on('selection:cleared', () => this._scope.$applyAsync(() => {
            this.properties = null;
            _update();
            this._scope.Draw.events({data: 'cleared'});  
            this.state.current = null;
            //this.state.saveState();                      
        }));
        this.state.canvas.on('object:moving', (options) => this._scope.$applyAsync(() => {           
            this.currentObj = options.target;          
            this.currentCanvas = this.currentObj.canvas;
            var currentBoundaries= this.currentObj.aCoords;
            this.canvasBoundaries = this.state.canvas.calcViewportBoundaries();
            this.calcOffset = this.state.canvas.calcOffset();    
            this.canvasWidth = this.state.canvas.getWidth();     
            this.canvasHeight = this.state.canvas.getHeight();             
           if((currentBoundaries.tr.x > this.canvasBoundaries.tr.x )  || 
           (currentBoundaries.br.x > this.canvasBoundaries.br.x ) ){            
               this.state.canvas.setWidth( this.canvasWidth + 300);  
               this.canvasWidth = this.width + 300;
           }
           if((currentBoundaries.br.y > this.canvasBoundaries.br.y ) && (currentBoundaries.bl.y > this.canvasBoundaries.bl.y )) {
                                
               this.state.canvas.setHeight(this.canvasHeight + 300); 
               this.canvasHeight = this.height + 300;
           }   
          /* 
           if(this.currentObj.currentHeight > this.currentCanvas.height || this.currentObj.currentWidth > this.currentCanvas.width){
               return;
           }    */     
           this.currentObj.setCoords();   
           if(  this.currentObj.getBoundingRect().top < 0 || this.currentObj.getBoundingRect().left < 0 ){
               this.currentObj.top = Math.max(this.currentObj.top, this.currentObj.top-this.currentObj.getBoundingRect().top);
               this.currentObj.left = Math.max(this.currentObj.left, this.currentObj.left-this.currentObj.getBoundingRect().left);
           }           
 
           if( this.canvasWidth != undefined && this.canvasHeight != undefined){
            this.state.isWidthChanged(this.canvasWidth , this.canvasHeight);  
           }         
           this.state.canvas.calcOffset();
           this.state.canvas.renderAll();
           this.state.saveState();
          
           this._scope.Draw.events({data: 'moving'}); 
                      
         }));     
         
    }

    rescale(container: JQuery, width: number, height: number) {
        this.width = width;
        this.height = height;
        container.width(width - 12 /* borders */);
        container.height(height - 11 /* borders */);
        this.state.rescale(width, height);
        if(this.canvasWidth != undefined ){
              this.state.canvas.setWidth( this.canvasWidth);     
               
        }
       if(this.canvasHeight != undefined){
            this.state.canvas.setHeight(this.canvasHeight);
           
        }      
    }

    async draw(tool: Tool, propertyState : any) {
        this.showGeneral = true;
        this.currentTool = tool;
        await this.state.draw(tool);
        //console.log(tool);
        if (this.state.current) {
            this.properties = this._tools.getProperties(this.state.current, tool.id);
            //console.log(propertyState);
            //console.log(this.properties);
        }
    }
    
    showList(key:any){//|| key == 'strokeDashArray' || key == 'strokeLineCap'
        if(key == 'borderColor' || key == 'fill' || key == 'text' || key == 'textBackgroundColor' || key == 'backgroundColor' || key == 'stroke'){
             return true;
        }
    }

    hideList(key:any){
        if(key == 'fontFamily'){
             return true;
        }
    }   
    onPaste() {   
        if(this.state.canvas == null || this.state.current == null){
            this._scope.Draw.events({data: 'copyPaste failure'}); 
        }
        this.state.onPaste();     
    }
     onCopy() {
        this.state.onCopy();    
    } 
  
    onRemove() {
        this._scope.Draw.events({data: 'remove draw controls'}); 
        //this.state.remove();
    }
}

