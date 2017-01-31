import * as _fabric from 'fabric';
import { Tool, Color } from '../models';
let fabric = (_fabric as any).fabric as typeof _fabric;

const textDefaults: fabric.ITextOptions = {
    fontSize: 32,
    fontFamily: 'Segoe MDL2 Assets'
};

export const Icon: Tool = {
    id: 'tool__icon',
    name: 'Draw Icon',
    icon: 'CirclePlus'
};

export const ICON_PROPS = [
    'fontSize',
    'fontWeight',
    'textBackgroundColor',
    'text'
];

export const drawIcon = (options?: fabric.ITextOptions): fabric.Text => {
    return new fabric.Text('', {
        ...textDefaults,
        ...options
    });
};
