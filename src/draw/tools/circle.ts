import * as _fabric from 'fabric';
import { Tool, Color } from '../models';
let fabric = (_fabric as any).fabric as typeof _fabric;

const circleDefaults: fabric.ICircleOptions = {
    radius: 60,
    borderColor: 'transparent',
    fill: 'transparent',
    stroke: new Color('#0078d7').hex
};

export const Circle: Tool = {
    id: 'tool__circle',
    name: 'Draw Circle',
    icon: 'CircleRing'
};

export const CIRCLE_PROPS = [
    'radius',
    'startAngle',
    'endAngle'
];

export const drawCircle = (options?: fabric.ICircleOptions): fabric.Circle => {
    return new fabric.Circle({
        ...circleDefaults,
        ...options
    });
};
