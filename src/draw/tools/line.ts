import { Action } from 'redux';
import { Tool, Color } from '../models';

const lineDefaults: fabric.ILineOptions = {
    x1: 0,
    y1: 0,
    x2: 10,
    y2: 10,
    borderColor: 'transparent',
    fill: new Color('#FF4444').hex
};

export const LINE_PROPS = [
    'x1',
    'y1',
    'x2',
    'y2',
];

export const Line: Tool = {
    id: 'tool__line',
    name: 'Draw Line',
    icon: 'CalculatorSubtract'
};

export const drawLine = (options: fabric.ILineOptions): fabric.IRect => {
    return new fabric.Line([0, 0, 10, 10], {
        ...lineDefaults,
        ...options
    });
};
