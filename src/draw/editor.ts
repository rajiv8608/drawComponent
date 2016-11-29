import { debounce } from 'lodash';
import * as $ from 'jquery';
import * as fabric from 'fabric';
import { IDrawConstructionOptions } from './interfaces';
import { DrawError } from './error';
import './styles/draw.scss';

let template = `
    <canvas class="draw__canvas"></canvas>
    <section class="draw__toolbox">
        <artice class="draw__tool">
            <i class="ms-Icon ms-Icon--CircleRing"></i>
        </artice>
        <artice class="draw__tool">
            <i class="ms-Icon ms-Icon--TriangleUp12"></i>
        </artice>
        <artice class="draw__tool">
            <i class="ms-Icon ms-Icon--EditMirrored"></i>
        </artice>
        <artice class="draw__tool">
            <i class="ms-Icon ms-Icon--Photo2Add"></i>
        </artice>
        <artice class="draw__tool">
            <i class="ms-Icon ms-Icon--CSS"></i>
        </artice>
        <artice class="draw__tool">
            <i class="ms-Icon ms-Icon--Checkbox"></i>
        </artice>
        <artice class="draw__tool">
            <i class="ms-Icon ms-Icon--ArrowUpRight8"></i>
        </artice>
        <artice class="draw__tool">
            <i class="ms-Icon ms-Icon--InsertTextBox"></i>
        </artice>
        <artice class="draw__tool">
            <i class="ms-Icon ms-Icon--FullScreen"></i>
        </artice>
    </section>
`;

export class Draw {
    private _canvas: JQuery;
    private _toolbox: JQuery;

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
        this._setup();
    }

    private _scale() {
        console.log('resize');
    }

    private _setup() {
        this.container.html(template);
        this._canvas = this.container.children('.draw_canvas');
        this._toolbox = this.container.children('.draw_toolbox');
        this.container.resize(debounce(() => this._scale(), 250));
        this.container.width(this.options.width);
        this.container.height(this.options.height);
    }

    dispose() {
        this.container.off('resize');
    }
}
