import * as _fabric from 'fabric';
import { Tool, Color } from '../models';
let fabric = (_fabric as any).fabric as typeof _fabric;
import { drawLine } from './line';
import { drawTriangle } from './triangle';

const arrowDefaults: any = {
    // width: 300,
    // height: 150,
    borderColor: 'transparent',
    fill: new Color('#dd3641').hex,
    stroke: new Color('#C0202B').hex,
    opacity: 1,
    strokeWidth: 2,
    originX: 'left',
    originY: 'top',
    
};

export const ARROW_PROPS = [
    'angle',
    'backgroundColor',
    'height',
    'width'
];

export const Arrow: Tool = {
    id: 'tool__polyline',
    name: 'Draw Arrow',
    icon: 'ArrowUpRight8',
    placeholderName: 'Arrow'
};

export const drawArrow = (options?: fabric.IPolylineOptions): fabric.Polyline => {

    // let triangle = drawTriangle({
    //     width: 30,
    //     height: 30,
    //     top: 50,
    //     left: 50
    // });

    // let line = drawLine({
    //     x1: 0,
    //     x2: 0,
    //     y1: 0,
    //     y2: 100,
    //     top: 80,
    //     left: 65
    // });

    // return new fabric.Group([line, triangle], {
    //     left: 100,
    //     top: 100,
    //     stroke: new Color('#000000').hex,
    //     strokeDashArray: [5, 10]
    // });
    
    let fromx = 50, fromy = 200, tox = 50, toy = 55;

    let angle = Math.atan2(toy - fromy, tox - fromx);

	let headlen = 15;  // arrow head size

	// bring the line end back some to account for arrow head.
	tox = tox - (headlen) * Math.cos(angle);
	toy = toy - (headlen) * Math.sin(angle);

	// calculate the points.
	var points = [
		{
			x: fromx,  // start point
			y: fromy
		}, {
			x: fromx - (headlen / 4) * Math.cos(angle - Math.PI / 2), 
			y: fromy - (headlen / 4) * Math.sin(angle - Math.PI / 2)
		},{
			x: tox - (headlen / 4) * Math.cos(angle - Math.PI / 2), 
			y: toy - (headlen / 4) * Math.sin(angle - Math.PI / 2)
		}, {
			x: tox - (headlen) * Math.cos(angle - Math.PI / 2),
			y: toy - (headlen) * Math.sin(angle - Math.PI / 2)
		},{
			x: tox + (headlen) * Math.cos(angle),  // tip
			y: toy + (headlen) * Math.sin(angle)
		}, {
			x: tox - (headlen) * Math.cos(angle + Math.PI / 2),
			y: toy - (headlen) * Math.sin(angle + Math.PI / 2)
		}, {
			x: tox - (headlen / 4) * Math.cos(angle + Math.PI / 2),
			y: toy - (headlen / 4) * Math.sin(angle + Math.PI / 2)
		}, {
			x: fromx - (headlen / 4) * Math.cos(angle + Math.PI / 2),
			y: fromy - (headlen / 4) * Math.sin(angle + Math.PI / 2)
		},{
			x: fromx,
			y: fromy
		}
	];

	return  new fabric.Polyline(points, {
		...arrowDefaults as any,
        ...options
	});
};
