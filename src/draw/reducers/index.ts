import * as angular from 'angular';
import { Reducer } from 'redux';
import { DrawModule } from '../module';
import { Tool } from '../models';
import { DrawToolsService } from '../tools';
import { createStore, Store } from 'redux';

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

const createReducer = (canvas: fabric.ICanvas, tools: DrawToolsService) => {
    return (state: IDrawState = initialState, action) => {
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

            case 'UPDATE': {
                let {props} = action;
                let currentObject = state.currentObject;
                let objects = canvas.getObjects();
                props.forEach((name, value) => {
                    console.log(`updating ${name}:${value}`);
                    currentObject.set(name, value);
                });
                return { ...state, objects, currentObject };
            }

            case 'REMOVE': {
                let currentObject = state.currentObject;
                currentObject.remove();
                canvas.setActiveObject(null);
                let objects = canvas.getObjects();
                return { ...state, objects, currentObject };
            }

            case 'DRAW': {
                let {tool} = state;
                let {options} = action;

                if (tool.id !== 'tool__image') {
                    let drawTool = tools.getToolAction(tool.id);
                    let currentObject = drawTool(options);
                    canvas.add(currentObject);
                    canvas.setActiveObject(currentObject);
                    let objects = canvas.getObjects();
                    return { ...state, objects, currentObject };
                }
                else {
                    return fabric.Image.fromURL(options, (oImg) => {
                        oImg.scale(0.5);
                        canvas.add(oImg);
                        canvas.setActiveObject(oImg);
                        let objects = canvas.getObjects();
                        return { ...state, objects, currentObject: oImg };
                    });
                }
            }
        }
    };
};

export class DrawStateService {
    private _canvas: fabric.ICanvas = null;
    currentState: Store<IDrawState>;

    constructor(private _tools: DrawToolsService) { }

    init(canvas$: HTMLCanvasElement) {
        let { __REDUX_DEVTOOLS_EXTENSION__ } = (window as any);
        this._canvas = new fabric.Canvas(canvas$);
        this.currentState = createStore<IDrawState>(createReducer(this._canvas, this._tools), __REDUX_DEVTOOLS_EXTENSION__ && __REDUX_DEVTOOLS_EXTENSION__());
        this._subscribeToEvents();
    }

    exportState() {
        if (this._canvas) {
            let source = this._canvas.toSVG(null);
            let blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
            let svgUrl = URL.createObjectURL(blob);
            let downloadLink = document.createElement('a');
            downloadLink.href = svgUrl;
            downloadLink.download = 'newesttree.svg';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    };

    private _subscribeToEvents() {
        if (this._canvas) {
            this._canvas.on('object:selected', () => this.currentState.dispatch({ type: 'SELECTION_CHANGED' }));
            this._canvas.on('selection:cleared', () => this.currentState.dispatch({ type: 'SELECTION_CHANGED' }));
        }
    };
}
