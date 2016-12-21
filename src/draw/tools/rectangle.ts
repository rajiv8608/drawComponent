import { Tool, Color } from '../models';

const rectangleDefaults: fabric.IRectOptions = {
    width: 30,
    height: 15,
    rx: 0,
    ry: 0,
    borderColor: 'transparent',
    fill: new Color('#FF4444').hex
};

export const Rectangle: Tool = {
    id: 'tool__rectangle',
    name: 'Draw Rectangle',
    icon: 'Checkbox'
};

export const drawRectangle = (options: fabric.IRectOptions): fabric.IRect => {
    return new fabric.Rect({
        ...rectangleDefaults,
        ...options
    });
};
