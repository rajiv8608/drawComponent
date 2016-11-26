import * as $ from 'jquery';
import * as fabric from 'fabric';
import { IDrawConstructionOptions } from './interfaces';
import { DrawError } from './error';

let template = `
    <canvas class="draw__canvas"></canvas>
    <div class="draw__toolbox"></div>
`;

export class Draw {
    private _canvas: HTMLCanvasElement;
    private _toolbox: HTMLElement;

    constructor(
        private container: JQuery,
        private options: IDrawConstructionOptions
    ) {
        if (this.container == null) {
            throw new DrawError('Canvas element cannot be null or undefined', 'Configuration');
        }
        if (this.options == null) {
            throw new DrawError('Options element cannot be null or undefined', 'Configuration');
        }
        this.options.aspectRatio = ~~(this.options.width / this.options.height);
    }

    private scale() {
    }

    private setup() {
        this.container.html(template);
        this._toolbox = this.container.find()
    }

    dispose() {
    }
}
