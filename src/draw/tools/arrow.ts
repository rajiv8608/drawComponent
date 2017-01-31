import * as _fabric from 'fabric';
import { Tool, Color } from '../models';
let fabric = (_fabric as any).fabric as typeof _fabric;
import { drawLine } from './line';
import { drawTriangle } from './triangle';

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

    let triangle = drawTriangle({
        width: 30,
        height: 30,
        top: 50,
        left: 50
    });

    let line = drawLine({
        x1: 0,
        x2: 0,
        y1: 0,
        y2: 100,
        top: 80,
        left: 65
    });

    return new fabric.Group([line, triangle], {
        left: 100,
        top: 100,
        stroke: new Color('#999999').hex,
        strokeDashArray: [5, 10]
    });
};