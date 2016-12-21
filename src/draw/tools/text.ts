import { Tool, Color } from '../models';

const textDefaults: fabric.IITextOptions = {
    fontFamily: 'Segoe UI',
    fontSize: 11
};

export const Text: Tool = {
    id: 'tool__text',
    name: 'Draw Text',
    icon: 'InsertTextBox'
};

export const drawText = (options: fabric.ITextOptions): fabric.IText => {
    return new fabric.Text('Text', {
        ...textDefaults,
        ...options
    });
};
