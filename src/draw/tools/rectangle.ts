import { Tool, Color } from '../models';

const rectangleDefaults: fabric.IRectOptions = {
    width: 300,
    height: 100,
    rx: 0,
    ry: 0,
    borderColor: 'transparent',
    fill: new Color('#00CC66').hex
};

export const RECTANGLE_PROPS = [
    'width',
    'height',
    'rx',
    'ry',
];

export const Rectangle: Tool = {
    id: 'tool__rectangle',
    name: 'Draw Rectangle',
    icon: 'Checkbox'
};

export const drawRectangle = (options?: fabric.IRectOptions): fabric.IRect => {
    return new fabric.Rect({
        ...rectangleDefaults,
        ...options
    });
};
