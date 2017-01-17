import { Tool, Color } from '../models';

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
    icon: 'Photo2'
};
