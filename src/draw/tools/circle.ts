import * as fabric from 'fabric';
import { Tool, Color } from '../models';

const circleDefaults: fabric.ICircleOptions = {
    radius: 60,
    borderColor: 'transparent',
    fill: new Color('#0078D7').hex
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
