import * as _fabric from 'fabric';
import { Tool, Color } from '../models';
let fabric = (_fabric as any).fabric as typeof _fabric;

const triangleDefaults: fabric.ITriangleOptions = {
    width: 300,
    height: 150,
    borderColor: 'transparent',
    fill: new Color('#dd3641').hex,
    stroke: new Color('#C0202B').hex,
    strokeWidth: 2
};

export const TRIANGLE_PROPS = [
    'width',
    'height'
];

export const Triangle: Tool = {
    id: 'tool__triangle',
    name: 'Draw Triangle',
    icon: 'TriangleUp12',
    placeholderName: 'Triangle'
};

export const drawTriangle = (options?: fabric.ITriangleOptions): fabric.Triangle => {
    return new fabric.Triangle({
        ...triangleDefaults,
        ...options
    });
};
