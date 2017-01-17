import { Tool, Color } from '../models';

const textDefaults: fabric.IITextOptions = {
    fontFamily: 'Segoe UI',
    fontSize: 16
};

export const TEXT_PROPS = [
    'fontSize',
    'fontWeight',
    'fontFamily',
    'textDecoration',
    'textAlign',
    'fontStyle',
    'lineHeight',
    'shadow',
    'textBackgroundColor',
    'text'
];

export const Text: Tool = {
    id: 'tool__text',
    name: 'Draw Text',
    icon: 'InsertTextBox'
};

export const drawText = (options?: fabric.ITextOptions): fabric.IText => {
    return new fabric.Text('Text', {
        ...textDefaults,
        ...options
    });
};
