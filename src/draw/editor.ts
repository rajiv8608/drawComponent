import * as angular from 'angular';
import * as $ from 'jquery';
import { DrawModule } from './module';
import { DrawError } from './core';
import { DrawStateService } from './reducers';
import { DrawToolsService, Tool } from './tools';
import debounce = require('lodash/debounce');
import './styles/draw.scss';

export class DrawController {
    tools: Tool[];
    width: number;
    height: number;
    properties: any;

    constructor(
        private _scope: angular.IScope,
        private _tools: DrawToolsService,
        public state: DrawStateService
    ) {
        this.tools = this._tools.defaultTools;
    }

    subscribeToEvents() {
        this.state.canvas.on('object:selected', () => this._scope.$applyAsync(() => {
            this.state.current = this.state.canvas.getActiveObject();
            if (this.state.current == null) {
                return;
            }

            this.properties = this._tools.getProperties(this.state.current, this.state.current.name);
        }));

        this.state.canvas.on('object:modified', () => this._scope.$applyAsync(() => {
            this.state.saveState();
            this.state.current = this.state.canvas.getActiveObject();
            if (this.state.current == null) {
                return;
            }

            this.properties = this._tools.getProperties(this.state.current, this.state.current.name);
        }));

        this.state.canvas.on('selection:cleared', () => this._scope.$applyAsync(() => {
            this.state.current = this.state.canvas.getActiveObject();
            if (this.state.current == null) {
                return;
            }

            this.properties = null;
        }));
    }

    rescale(container: JQuery, width: number, height: number) {
        this.width = width;
        this.height = height;
        container.width(width - 2 /* borders */);
        container.height(height - 1 /* borders */);
        this.state.rescale(width, height);
    };

    async draw(tool: Tool) {
        switch (tool.id) {
            case 'tool__save': return this.state.save();
            case 'tool__load': return this.state.loadFabricSVG();
            default:
                await this.state.add(tool);
                this.properties = this._tools.getProperties(this.state.current, tool.id);
        }
    }

    bringToFront() {
        this.state.bringToFront();
    }

    sendToBack() {
        this.state.sendToBack();
    }

    remove() {
        this.state.remove();
    }

    update() {
        this.state.update(this.properties, this.state.current.name);
    }
}

