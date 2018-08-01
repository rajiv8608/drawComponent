import * as _fabric from 'fabric';
import { Tool, Color } from '../models';
let fabric = (_fabric as any).fabric as typeof _fabric;

const rectangleDefaults: fabric.IRectOptions = {
    width: 300,
    height: 100,
    rx: 0,
    ry: 0,
    borderColor: 'transparent',
    fill: new Color('#dd3641').hex,
    stroke: new Color('#C0202B').hex,
    strokeWidth: 2,    
};

export const RECTANGLE_PROPS = [
    'width',
    'height',
    'rx',
    'ry',
];

export const Rectangle: Tool = {
    id: 'tool__rect',
    name: 'Draw Rectangle',
    icon: 'Checkbox',
    placeholderName: 'Rectangle'
};

export const drawRectangle = (options?: fabric.IRectOptions): fabric.Rect => {
    return new fabric.Rect({
        ...rectangleDefaults,
        ...options
    });
};
