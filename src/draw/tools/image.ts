import * as _fabric from 'fabric';
import { Tool, Color } from '../models';
let fabric = (_fabric as any).fabric as typeof _fabric;

const imageDefaults: fabric.IImageOptions = {
    crossOrigin: '',
    alignX: 'mid',
    alignY: 'mid',
    meetOrSlice: 'meet',
    filters: []
};

export const IMAGE_PROPS = ['url'];

export const Image: Tool = {
    id: 'tool__image',
    name: 'Draw Image',
    icon: 'Photo2',
    placeholderName: 'Image'
};

export const drawImage = (options?: fabric.ITextOptions): Promise<fabric.Image> => {
    return new Promise((resolve, reject) => {
        let url = window.prompt('URL', 'Enter the image url');
        if (url == null || url.trim() === '' || url.trim() === 'Enter the image url') {
            reject(`Invalid Image URL: ${url}`);
        }
        fabric.Image.fromURL(url, (image) => {
            image.scale(0.5);
            resolve(image);
        });
    });
};
