import * as _fabric from 'fabric';
import { Tool, Color } from '../models';
let fabric = (_fabric as any).fabric as typeof _fabric;

const triangleDefaults: fabric.ITriangleOptions = {
    width: 300,
    height: 150,
    borderColor: 'transparent',
    fill: new Color('#FF4444').hex
};

export const TRIANGLE_PROPS = [
    'width',
    'height'
];

export const Triangle: Tool = {
    id: 'tool__triangle',
    name: 'Draw Triangle',
    icon: 'TriangleUp12'
};

export const drawTriangle = (options?: fabric.ITriangleOptions): fabric.Triangle => {
    return new fabric.Triangle({
        ...triangleDefaults,
        ...options
    });
};
