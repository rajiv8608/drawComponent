import * as _fabric from 'fabric';
import { Tool, Color } from '../models';
import { loadFile } from '../core';
let fabric = (_fabric as any).fabric as typeof _fabric;

const svgDefaults: fabric.IObjectOptions = {       
    fill: new Color('#dd3641').hex
};

export const SVG_PROPS = [
    'borderColor',
    'width',
    'height',
    'top',
    'left',    
    'angle',
    'scaleX',
    'scaleY',
    'fill',
    'opacity'
];

export const SVG: Tool = {
    id: 'tool__svg',
    name: 'Draw SVG',
    icon: 'FabricPictureLibrary',
    placeholderName: 'SVG'
};

export const drawSVG = (options?: any): Promise<any> => {
   let data = '';          
    switch(options.id){
        case 'tool__arrowdown':
            data = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 128 128" style="enable-background:new 0 0 128 128;" xml:space="preserve"><style type="text/css">	.st0{fill:#A4A6A9;}</style><path class="st0" d="M124,17.2c-0.5,0-1-0.1-1.5-0.1c-1.4-0.2-2.8-0.4-4.2-0.4c-1,0-2.1-0.1-3.1-0.2c-1.1,0-2.4,0-3.6-0.1  c-2.6,0-5.5,0.1-8.7,0.4c-1.6,0.1-3.2,0.4-5,0.5c-1.8,0.2-3.6,0.5-5.4,0.9c-3.8,0.7-7.6,1.7-11.3,2.9c-4,1.3-7.9,2.8-11.7,4.6  c-4,1.9-7.8,3.9-11.6,6.2c-3.7,2.4-7.3,4.9-10.7,7.7c-3.3,2.8-6.5,5.7-9.5,8.8c-2.8,3-5.4,6.1-7.9,9.3c-1.2,1.5-2.2,3-3.2,4.6  c-1,1.5-2,3-2.9,4.5c-0.9,1.5-1.6,2.9-2.4,4.2c-0.7,1.4-1.4,2.7-2,4c-0.6,1.2-1.1,2.5-1.6,3.6c-0.5,1.1-0.9,2.1-1.2,3.1  c-0.7,1.9-1.2,3.4-1.6,4.4c-0.2,0.5-0.4,1.1-0.5,1.6l18.3,4.7c0,0,0.1-0.5,0.2-1.4c0.2-1.3,0.5-2.5,0.9-3.7c0.2-0.9,0.4-1.7,0.6-2.7  s0.6-2,1-3.1c0.4-1.1,0.7-2.2,1.2-3.5c0.5-1.2,1-2.5,1.5-3.9L40,70c0.7-1.4,1.4-2.9,2.2-4.4c1.7-3.1,3.6-6.1,5.6-9  c2.2-3.1,4.6-6,7.2-8.8c2.7-2.9,5.6-5.6,8.6-8.2c3.1-2.6,6.3-5,9.7-7.1c3.4-2.1,6.9-4,10.2-5.7c3.3-1.6,6.7-3,10.2-4.2  c1.6-0.6,3.4-1,5-1.5c1.6-0.5,3.2-0.9,4.7-1.2c3-0.7,5.9-1.1,8.3-1.5c1.2-0.1,2.5-0.2,3.5-0.4c1-0.1,2.1-0.1,3-0.2  c1.9-0.1,3.2-0.1,4.2-0.2C123.1,17.3,123.5,17.2,124,17.2"/><polygon class="st0" points="2,83.5 46,90.9 20.2,109.1 "/></svg>';
            break;
        case 'tool__arrowcircle':
            data = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 256 256" style="enable-background:new 0 0 256 256;" xml:space="preserve"><style type="text/css">	.st0{fill:#F58220;}	.st1{fill:#FFFFFF;}</style><path class="st0" d="M238.5,133c0,62.4-50.6,113-113,113s-113-50.6-113-113s50.6-113,113-113C187.9,20,238.5,70.6,238.5,133  L238.5,133"/><path class="st0" d="M118.3,138.2c0.2,0.4,0,0.8-0.4,1c-0.1,0-0.2,0.1-0.2,0.1c-0.5,0.1-0.9-0.1-1.1-0.6l0,0  c-0.1-0.5,0.2-0.9,0.6-1.1C117.7,137.6,118.2,137.8,118.3,138.2z"/><path class="st0" d="M134.1,133.2c0.1,0.5-0.1,1-0.6,1.1c-0.4,0.2-0.9-0.1-1.1-0.5c0,0,0,0,0,0v-0.1c-0.1-0.5,0.2-0.9,0.7-1  C133.6,132.5,134,132.8,134.1,133.2L134.1,133.2z"/><path class="st0" d="M129,134.8c0.2,0.5,0,1-0.5,1.2c-0.5,0.2-1,0-1.2-0.5c0-0.1,0-0.1,0-0.2c-0.2-0.5,0.1-0.9,0.5-1.1c0,0,0,0,0,0  h0C128.4,134.1,128.8,134.3,129,134.8z"/><path class="st0" d="M136.6,132.4c0.1,0.5-0.2,0.9-0.6,1.1c-0.5,0.1-0.9-0.2-1-0.7c-0.1-0.4,0.1-0.8,0.5-1  C136,131.6,136.4,131.9,136.6,132.4L136.6,132.4z"/><path class="st1" d="M132.8,173c-12,1.3-22.3-2.1-32.2-8.3c1.3-1.1,2.4-2.1,3.9-3.4c-6.1-0.5-11.8-1-17.6-1.5  c-1,5.7-1.9,11.2-2.9,17.2c1.5-1.5,2.9-2.6,4.2-3.9c13.4,12.6,29,18,47.2,14.7c-2.8-2.4-5.5-5-8.3-7.4  C129.1,177.7,130.9,175.5,132.8,173z"/><path class="st1" d="M161.9,145.4c-1,5.7-3.7,11-7.8,15.2c-3.8,4.3-8.4,7.8-13.6,10.4c-0.2-1.3-0.3-2.4-0.5-4  c-3.2,4.5-6.3,8.9-9.5,13.4c3.9,3.7,7.6,7.3,11.3,10.7c0.1-0.9,0.1-1.7,0-2.6c-0.3-1.6,0.3-2.1,1.6-2.4c11.6-4.3,21.4-12.4,27.8-23  c2.2-3.3,3.8-7,4.7-10.8c-3.1,1.1-5.8,2.1-8.6,3.1C165.7,152,163.9,148.8,161.9,145.4z"/><path class="st1" d="M151.4,109.1c9.7,7.6,13.1,23.6,12,30.1c-0.8-0.2-1.5-0.5-2.6-0.8c2.9,4.9,5.7,9.4,8.4,13.9  c4.4-1.6,8.6-3.2,13.1-4.9c-1.2-0.6-2.4-1.1-3.7-1.5c-0.6-0.1-1-0.7-0.9-1.3v-0.2c0.3-2.6,0.8-5.2,1-7.8c0.6-11-2.4-21.8-8.6-30.9  c-1.6-2.3-3.4-4.4-5.3-6.5c-0.2,0-0.3,0.2-0.5,0.3c-0.2,2.1-0.5,4.4-0.6,6.6c0,1.1-0.5,1.6-1.6,1.6  C158.7,108.2,155.1,108.6,151.4,109.1z"/><path class="st1" d="M91.7,121.4c4.5-9.3,11.9-16.9,21-21.7c0.8,1.8,1.5,3.4,2.3,5.2c2.8-5.3,5.5-10.5,8.3-16  c-5.2-3.1-10.2-6-15.2-8.9c-0.1,0.1-0.1,0.2-0.2,0.3c0.5,1.6,1,3.1,1.5,4.7c-15.4,6.1-26.7,16-32.7,31.6c3.6-1.5,7.1-3.1,10.7-4.5  C89,115.3,90.2,118.3,91.7,121.4z"/><path class="st1" d="M95.1,158.3c-6.2-8.7-8.7-19.5-7-30.1c1.8,0.6,3.2,1.1,5,1.6c-2.4-5.2-4.7-10-7-15c-5.7,2.4-11,4.9-16.8,7.3  c1.8,0.5,3.4,1,5,1.3c-1.9,7.5-2,15.3-0.5,22.8c1.2,7.7,4.3,15,8.9,21.4c0.6-3.6,1.1-6.8,1.6-9.9C88,157.7,91.4,158,95.1,158.3z"/><path class="st1" d="M121.3,98.1c4.4,0.5,8.7,0.6,12.9,1.5c4.3,0.9,8.4,2.7,12,5.2c-1,1-1.8,1.6-3.1,2.8c6.3-0.6,12.1-1.1,18-1.8  c0.5-4.4,0.8-8.6,1.3-13.1c-1.1,1-2.1,1.6-2.9,2.3c-11.4-9.1-26-13.2-40.5-11.2c2.4,1.9,4.7,3.6,6.8,5.3  C124.4,92.1,122.8,95.4,121.3,98.1z"/></svg>';                    break;
        case 'tool__wheel':
            data = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 256 256" style="enable-background:new 0 0 256 256;" xml:space="preserve"><style type="text/css">	.st0{fill:none;stroke:#808285;stroke-width:1.04;stroke-miterlimit:10;stroke-dasharray:2.07,2.07;}	.st1{fill:none;stroke:#A7A9AC;stroke-miterlimit:10;stroke-dasharray:1.99,1.99;}	.st2{fill:#0093D0;}	.st3{fill:#FFFFFF;}</style><circle class="st0" cx="127.6" cy="128.4" r="89.6"/><line class="st1" x1="128" y1="40.8" x2="128" y2="214.6"/><line class="st1" x1="181.6" y1="59.2" x2="74.4" y2="196.2"/><line class="st1" x1="211.5" y1="103.4" x2="44.5" y2="152"/><line class="st1" x1="210.1" y1="156.2" x2="45.9" y2="99.2"/><line class="st1" x1="176" y1="200.2" x2="80" y2="55.2"/><path class="st2" d="M154.5,124.6c-1.2-5-5.7-8.5-10.9-8.5h-0.1c0-6.2-5-11.2-11.2-11.2c-4.1,0-7.9,2.3-9.9,5.9  c-1.1-0.4-2.3-0.7-3.5-0.7c-5.8,0-10.5,4.7-10.5,10.5l0,0v0.1c-0.5-0.1-0.9-0.1-1.4-0.1c-6.6,0-11.9,5.3-11.9,11.9  c0,6.6,5.3,11.9,11.9,11.9c0,0,0,0,0,0h43.7c5.7,0,10.3-4.6,10.3-10.3l0,0C160.9,129.9,158.4,126.2,154.5,124.6"/><path class="st3" d="M210.9,101.2c0.1-0.2,0.1-0.4,0.3-0.6c0.2-0.2,0.5-0.2,0.7-0.1c0.1,0,0.1,0.1,0.1,0.2c0.1,0.3,0.2,0.6,0.1,0.9  c-0.1,0.3-0.3,0.4-0.6,0.4c-0.2,0-0.4-0.3-0.4-0.6C211,101.4,211,101.3,210.9,101.2L210.9,101.2z"/></svg>';
            break;
    } 

    return new Promise(async (resolve) => {
     fabric.loadSVGFromString(data, (objects, opts) => {
        let shape = fabric.util.groupSVGElements(objects, opts);
        
        let extobj = {...svgDefaults, ...options};
        let items = Object.keys(extobj);
        for(var x = 0; x < items.length; x++) {
            if(SVG_PROPS.hasOwnProperty(items[x])) {
                shape.set(items[x], extobj[items[x]]);
            }
        }
        shape.set("fill", extobj.fill);
        shape.set("id", options.id);
        shape.set("name", options.name);
        if (shape.isSameColor && shape.isSameColor() && !shape.getObjects()) {
            shape.setFill(extobj.fill);
        }
        else if (shape.getObjects()) {
            for (var i = 0; i < shape.getObjects().length; i++) {
                let item = shape.getObjects()[i];
                if(item.get("fill") !== "#FFFFFF" && item.get("fill") !== "none" && item.get("fill")!== ""){
                    shape.getObjects()[i].setFill(extobj.fill);
                }                
            }
        }
        resolve(shape);
     });
    });
};
