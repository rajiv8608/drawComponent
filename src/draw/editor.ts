import * as angular from 'angular';
import { DrawModule } from './module';
import { DrawError } from './core';
import { DrawStateService, IDrawState } from './reducers';
import { DrawToolsService, Tool } from './tools';
import { debounce } from 'lodash';
import * as $ from 'jquery';
import * as _fabric from 'fabric';
import './styles/draw.scss';

// Minor hack to fix fabric export.
const fabric: typeof _fabric = (_fabric as any).fabric;

export class DrawController {
    state: IDrawState;
    tools: Tool[];
    width: number;
    height: number;
    properties: string[];

    constructor(
        private _scope: angular.IScope,
        private _toolsService: DrawToolsService,
        private _stateService: DrawStateService
    ) {
        this.tools = this._toolsService.defaultTools;
    }

    listenForChanges() {
        this._stateService.currentState.subscribe(
            debounce(() =>
                this._scope.$applyAsync(() => {
                    this.state = this._stateService.currentState.getState();
                }), 250
            )
        );
    }

    rescale(container) {
        container.width((+this.width) + 40);
        container.height(+this.height);
        this._stateService.currentState.dispatch({
            type: 'RESCALE',
            width: +this.width,
            height: +this.height
        });
    };

    drawTool(tool: Tool) {
        this._stateService.currentState.dispatch({
            type: 'SELECT_TOOL',
            tool
        });

        this._stateService.currentState.dispatch({
            type: 'DRAW',
            options: { width: 10, height: 20, fill: '#f55', opacity: 0.7 }
        });
    }

    remove() {
        this._stateService.currentState.dispatch({
            type: 'REMOVE',
        });
    }

    update() {
        this._stateService.currentState.dispatch({
            type: 'UPDATE',
        });
    }

    clear() {
        this._stateService.currentState.dispatch({
            type: 'CLEAR',
        });
    }
}

