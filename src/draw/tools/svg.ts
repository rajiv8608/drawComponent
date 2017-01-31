import * as _fabric from 'fabric';
import { Tool, Color } from '../models';
import { loadFile } from '../core';
let fabric = (_fabric as any).fabric as typeof _fabric;

export const SVG: Tool = {
    id: 'tool__svg',
    name: 'Draw SVG',
    icon: 'FabricPictureLibrary'
};

export const drawSVG = async (options?: fabric.IObjectOptions): Promise<any> => {
    return new Promise(async (resolve) => {
        let data = await loadFile();
        fabric.loadSVGFromString(data, (objects) => {
            let group = fabric.util.groupSVGElements(objects, options);
            resolve(group);
        });
    });
};
