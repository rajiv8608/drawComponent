import { Action } from 'redux';
import { Tool, Color } from '../models';

const circleDefaults: fabric.ICircleOptions = {
    radius: 20,
    borderColor: 'transparent',
    fill: new Color('#FF4444').hex
};

export const Circle: Tool = {
    id: 'tool__rectangle',
    name: 'Draw Circle',
    icon: 'CircleRing'
};
