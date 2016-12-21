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

export const Line: Tool = {
    id: 'tool__line',
    name: 'Draw Line',
    icon: 'CalculatorSubtract'
};
