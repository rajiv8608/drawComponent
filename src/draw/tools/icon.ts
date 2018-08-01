import * as _fabric from 'fabric';
import { Tool, Color } from '../models';
let fabric = (_fabric as any).fabric as typeof _fabric;

const iconDefaults: fabric.ITextOptions = {
    fontSize: 50,
    fontFamily: "BOD-Icon-fonts",
    fill: new Color('#dd3641').hex,
    height: 50,
    width: 50
};

export const Icon: Tool = {
    id: 'tool__icon',
    name: 'Draw Icon',
    icon: 'CirclePlus',
    placeholderName: 'Icon'
};

export const ICON_PROPS = [
    'fontSize',
    'fontWeight',
    'textBackgroundColor',
    'text',
    'fontClass',
    'fontCode',
    'fontDesc',
    'fontIconCode'
];

export const drawIcon = (options?: fabric.ITextOptions): fabric.Text => {
    return new fabric.Text(options.text, {
        ...iconDefaults,
        ...options
    });
};
