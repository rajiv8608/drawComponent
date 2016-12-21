import { Action } from 'redux';
import { Tool, Color } from '../models';

const circleDefaults: fabric.ICircleOptions = {
    radius: 20,
    borderColor: 'transparent',
    fill: new Color('#FF4444').hex
};

export const Circle: Tool = {
    id: 'tool__circle',
    name: 'Draw Circle',
    icon: 'CircleRing'
};

export const drawCircle = (options: fabric.ICircleOptions): fabric.ICircle => {
    return new fabric.Circle({
        ...circleDefaults,
        ...options
    });
};
