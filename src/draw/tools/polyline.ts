import { Action } from 'redux';
import { Tool, Color } from '../models';

const polylineDefaults: fabric.IPolylineOptions = {
    borderColor: 'transparent',
    fill: new Color('#FF4444').hex
};

export const Polyline: Tool = {
    id: 'tool__polyline',
    name: 'Draw Polyline',
    icon: 'Flow'
};

export const drawPolyline = (options: fabric.IPolylineOptions): fabric.IPolyline => {
    return new fabric.Polyline([{ x: 0, y: 0 }, { x: 10, y: 10 }], {
        ...polylineDefaults,
        ...options
    });
};
