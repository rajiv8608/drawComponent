import * as _fabric from 'fabric';
import { Tool, Color } from '../models';
let fabric = (_fabric as any).fabric as typeof _fabric;

const arrowDefaults: fabric.ITriangleOptions = {
    width: 300,
    height: 150,
    borderColor: 'transparent',
    fill: new Color('#FF4444').hex
};

export const ARROW_PROPS = [
    'width',
    'height'
];

export const Arrow: Tool = {
    id: 'tool__arrow',
    name: 'Draw Arrow',
    icon: 'ArrowUpRight8'
};

export const drawArrow = (options?: fabric.ITriangleOptions): fabric.Group => {

    let line = new fabric.Line([0, 0, 10, 10], {
        top: 133,
        left: 908,
        angle: 316,
        stroke: 'black',
        strokeWidth: 2
    });
    let triangle = new fabric.Triangle({
        width: 20,
        height: 15,
        borderColor: 'black',
        fill: 'black',
        top: 144,
        left: 895,
        angle: 269,
        stroke: 'black',
    });
    return new fabric.Group([line, triangle], { left: 100, top: 100 });
};