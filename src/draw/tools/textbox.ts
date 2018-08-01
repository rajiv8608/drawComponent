import * as _fabric from 'fabric';
import { Tool, Color } from '../models';
let fabric = (_fabric as any).fabric as typeof _fabric;

const textboxDefaults: fabric.IITextOptions = {
    fontFamily: 'Segoe UI',
    fontSize: 32,
    fill: new Color('#000000').hex,
    editable:true
};

export const TEXTBOX_PROPS = [
    'fontSize',
    'fontWeight',
    'fontFamily',
    'textDecoration',
    'textAlign',
    'fontStyle',
    'lineHeight',
    'shadow',
    'textBackgroundColor',
    'text',
    'top',
    'left'
];

export const Textbox: Tool = {
    id: 'tool__textbox',
    name: 'Draw Text',
    icon: 'InsertTextBox',
    placeholderName: 'Text'
};

export const drawTextbox = (options?: fabric.IITextboxOptions): fabric.Textbox => {
    return new fabric.Textbox('Text', {
        ...textboxDefaults as any,
        ...options
    });
};
