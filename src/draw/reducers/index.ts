import { Reducer } from 'redux';
import { Tool } from '../models';
import { getToolAction } from '../tools';

let canvas: fabric.ICanvas = null;

export interface IDrawState {
    isInitialzed?: boolean
    tool?: Tool,
    currentObject?: fabric.IObject,
    objects?: fabric.IObject[],
};

const initialState: IDrawState = {
    isInitialzed: false,
    tool: null,
    currentObject: null,
    objects: [],
};

const initialize = (canvas$: HTMLCanvasElement) => {
    canvas = new fabric.Canvas(canvas$);
    return !(canvas == null);
};

export const subscribeToEvents = (action: (type: string, options: any) => void) => {
    if (canvas) {
        canvas.on('mouse:down', (options) => {
            let {clientX, clientY} = (options.e as any);

            if (options.target) {
                action('SELECTION_CHANGED', options);
            }
            else {
                action('MOUSE_DOWN', options);
            }
        });

        return true;
    }

    return false;
};

export const reducer: Reducer<IDrawState> = (state: IDrawState = initialState, action) => {
    switch (action.type) {
        case 'SELECT_TOOL': {
            let {tool} = action;
            return { ...state, tool };
        }

        case 'RESCALE': {
            let {width, height} = action;
            canvas.setWidth(width);
            canvas.setHeight(height);
            return state;
        }

        case 'SELECTION_CHANGED': {
            let currentObject = canvas.getActiveObject();
            return { ...state, currentObject };
        }

        case 'INIT': {
            let {canvas$} = action;
            let isInitialzed = initialize(canvas$[0]);
            return { ...state, isInitialzed };
        }

        case 'DRAW': {
            let {tool} = state;
            let {options} = action;
            let drawTool = getToolAction(tool.id);
            let currentObject = drawTool(options);
            canvas.add(currentObject);
            let objects = canvas.getObjects();
            return { ...state, objects, currentObject };
        }

        case 'SHAPE_DRAWN': {
            return;
        }

        case 'UNDO': {
            return;
        }

        case 'REDO': {
            return;
        }

        default: return state;
    }
};

