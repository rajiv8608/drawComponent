import * as angular from 'angular';
import * as $ from 'jquery';
import { DrawModule } from './module';
import { DrawError } from './core';
import { DrawStateService } from './reducers';
import { DrawToolsService, Tool } from './tools';
import { debounce } from 'lodash';
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
            this.properties = this._tools.getProperties(this.state.current, this.state.current.name);
        }));

        this.state.canvas.on('object:modified', () => this._scope.$applyAsync(() => {
            this.state.current = this.state.canvas.getActiveObject();
            this.properties = this._tools.getProperties(this.state.current, this.state.current.name);
        }));

        this.state.canvas.on('selection:cleared', () => this._scope.$applyAsync(() => {
            this.state.current = this.state.canvas.getActiveObject();
            this.properties = null;
        }));
    }

    rescale(container) {
        container.width((+this.width) + 40);
        container.height(+this.height);
        this.state.rescale(+this.width, +this.height);
    };

    async draw(tool: Tool) {
        switch (tool.id) {
            case 'tool__save': return this.state.save();
            case 'tool__load': return this.state.loadFabricSVG();
            case 'tool__arrow': {
                let rectangle = this.state.add(this.tools.find(tool => tool.id === 'tool__rectangle'), { height: 2, width: 300, fill: '#000000', top: (this.height) / 2, left: (this.width - 300) / 2 });
                let triangle = this.state.add(this.tools.find(tool => tool.id === 'tool__triangle'), { height: 20, width: 20, fill: '#000000', angle: -90, top: (this.height) / 2, left: (this.width - 300) / 2 });
                return await Promise.all([rectangle, triangle]);
            }
            default:
                await this.state.add(tool);
                this.properties = this._tools.getProperties(this.state.current, tool.id);
        }
    }

    remove() {
        this.state.remove();
    }

    update() {
        this.state.update(this.properties, this.state.current.name);
    }
}

