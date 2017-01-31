import * as _fabric from 'fabric';
import { Tool, Color } from '../models';
let fabric = (_fabric as any).fabric as typeof _fabric;

const lineDefaults: fabric.ILineOptions = {
    x1: 0,
    y1: 0,
    x2: 300,
    y2: 300,
    borderColor: 'transparent',
    fill: new Color('#000000').hex
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

export const drawLine = (options?: fabric.ILineOptions): fabric.Rect => {
    return new fabric.Line([0, 0, 10, 10], {
        ...lineDefaults,
        ...options
    });
};
