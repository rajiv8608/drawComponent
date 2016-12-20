import { createStore, Store } from 'redux';
import { debounce } from 'lodash';
import * as $ from 'jquery';
import * as _fabric from 'fabric';
import { Tools, Drawing, DrawError, IDrawState, reducer } from './core';
import './styles/draw.scss';

// Minor hack to fix fabric export.
const fabric: typeof _fabric = (_fabric as any).fabric;

let editorTemplate = `
    <canvas class="draw__canvas"></canvas>
    <section class="draw__toolbox"></section>
`;

let actionTemplate = `
    <artice class="draw__tool" id="{{id}}" title="{{name}}">
        <i class="ms-Icon ms-Icon--{{icon}}"></i>
    </artice>
`;

export interface IDrawConstructionOptions {
    width: number,
    height: number
}

export class Draw {
    private _toolbox$: JQuery;
    private _actions$: JQuery[];
    private _canvas: fabric.ICanvas;
    private _state: IDrawState;
    private _store: Store<IDrawState>;

    constructor(
        private _container$: JQuery,
        private _size: IDrawConstructionOptions
    ) {
        if (this._container$ == null) {
            throw new DrawError('Canvas element cannot be null or undefined', 'Configuration');
        }
        if (this._size == null) {
            throw new DrawError('Options element cannot be null or undefined', 'Configuration');
        }
        this._setup();
        this._loadActions();

        this._store = createStore<IDrawState>(reducer);
        this._store.subscribe(() => {
            this._state = this._store.getState();
        });
    }

    public rescale(options: IDrawConstructionOptions) {
        let { width, height } = options;
        this._size = options;
        this._container$.width(width + 40);
        this._container$.height(height);
        this._canvas.setWidth(width);
        this._canvas.setHeight(height);
    }

    private _setup() {
        this._container$.html(editorTemplate);
        let canvas$ = this._container$.children('.draw__canvas');
        this._canvas = new fabric.Canvas(canvas$[0] as HTMLCanvasElement);
        this._toolbox$ = this._container$.children('.draw__toolbox');
        this._container$.resize(debounce(() => this.rescale(this._size), 250));
        this.rescale(this._size);
    }

    private _loadActions() {
        this._actions$ = Tools.DEFAULT_TOOLS.map(item => {
            let template = actionTemplate.replace('{{id}}', item.id);
            template = template.replace('{{name}}', item.name);
            template = template.replace('{{icon}}', item.icon);

            let action = $(template);
            this._toolbox$.append(action);
            action.click(e => this._store.dispatch(new Drawing.SwitchToolAction()));
            return action;
        });
    }

    dispose() {
        this._container$.off('resize');
        this._actions$.forEach(action => action.off('click'));
    }
}
