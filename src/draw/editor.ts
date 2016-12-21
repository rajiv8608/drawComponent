import { createStore, Store } from 'redux';
import { debounce } from 'lodash';
import * as $ from 'jquery';
import * as _fabric from 'fabric';
import { DrawError } from './core';
import { IDrawState, reducer, subscribeToEvents } from './reducers';
import { DEFAULT_TOOLS } from './tools';
import './styles/draw.scss';

// Minor hack to fix fabric export.
const fabric: typeof _fabric = (_fabric as any).fabric;

let editorTemplate = `
    <canvas class="draw__canvas"></canvas>
    <section class="draw__toolbox"></section>
    <section class="draw__properties"></section>
`;

let actionTemplate = `
    <artice class="draw__tool" id="{{id}}" title="{{name}}">
        <i class="ms-Icon ms-Icon--{{icon}}"></i>
    </artice>
`;

let propertyTemplate = `
    <div class="ms-TextField">
        <label class="ms-Label">{{name}}</label>
        <input class="ms-TextField-field" type="text" value="{{value}}" placeholder="{{name}}" >
    </div>
`;

export interface IDrawConstructionOptions {
    width: number,
    height: number
}

export class Draw {
    private _toolbox$: JQuery;
    private _properties$: JQuery;
    private _properties: any[] = [];
    private _tools$: JQuery[];
    private _state: IDrawState;
    private _store: Store<IDrawState>;
    private _currentObject: any;

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
        let { __REDUX_DEVTOOLS_EXTENSION__ } = (window as any);

        this._store = createStore<IDrawState>(reducer, __REDUX_DEVTOOLS_EXTENSION__ && __REDUX_DEVTOOLS_EXTENSION__());

        this._store.subscribe(() => this._render());

        this._setup();
        this._loadActions();
    }

    dispose() {
        this._container$.off('resize');
        this._tools$.forEach(action => action.off('click'));
    }

    public rescale(options: IDrawConstructionOptions) {
        let { width, height } = options;
        this._size = options;
        this._container$.width(width + 40);
        this._container$.height(height);

        this._store.dispatch({
            type: 'RESCALE',
            width,
            height
        });
    }

    private _setup() {
        this._container$.html(editorTemplate);
        let canvas$ = this._container$.children('.draw__canvas');

        this._store.dispatch({
            type: 'INIT',
            canvas$
        });

        this._toolbox$ = this._container$.children('.draw__toolbox');
        this._properties$ = this._container$.children('.draw__properties');
        this._container$.resize(debounce(() => this.rescale(this._size), 250));
        this.rescale(this._size);
        subscribeToEvents((type: string, options: any) => this._event(type, options));
    }

    private _loadActions() {
        this._tools$ = DEFAULT_TOOLS.map(tool => {
            let template = actionTemplate.replace('{{id}}', tool.id);
            template = template.replace('{{name}}', tool.name);
            template = template.replace('{{icon}}', tool.icon);

            let action = $(template);
            this._toolbox$.append(action);
            action.click(e => {
                this._store.dispatch({
                    type: 'SELECT_TOOL',
                    tool
                });

                this._store.dispatch({
                    type: 'DRAW',
                    options: { width: 10, height: 20, fill: '#f55', opacity: 0.7 }
                });
            });
            return action;
        });
    }

    private _event(type: string, options: fabric.IEvent) {
        switch (type) {
            case 'SELECTION_CHANGED': {
                this._store.dispatch({ type: 'SELECTION_CHANGED' });
                break;
            }

            case 'MOUSE_DOWN': {
                this._store.dispatch({ type: 'SELECTION_CHANGED' });
                break;
            }
        }
    }

    private _render = debounce(() => {
        this._state = this._store.getState();
        if (this._state && this._state.isInitialzed) {
            this._renderProperties(this._state.currentObject);
        }
    }, 200);

    private _renderProperties(obj) {
        if (this._properties$ == null) {
            return;
        }

        if (obj) {
            this._properties.forEach(item => {
                item.off('change');
            });

            this._properties$.html('');

            let serialize = JSON.stringify(obj);
            let properties = JSON.parse(serialize);

            this._properties = $.map(properties, (value, name) => {
                let template = propertyTemplate.replace('{{name}}', name);
                template = template.replace('{{value}}', value);

                let property = $(template);
                this._properties$.append(property);
                let input = property.children('input');
                input.change(() => {
                    let value = input.val();
                    this._store.dispatch({ type: 'PROPERTY_UPDATED', name, value });
                });

                return input;
            });

            this._properties$.show();
        }
        else {
            this._properties$.hide();
        }
    }
}
