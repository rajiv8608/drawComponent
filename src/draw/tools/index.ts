import { DrawModule } from '../module';
import { Tool } from '../models';
import { Circle, drawCircle, CIRCLE_PROPS } from './circle';
import { Triangle, drawTriangle, TRIANGLE_PROPS } from './triangle';
import { Rectangle, drawRectangle, RECTANGLE_PROPS } from './rectangle';
import { Line, drawLine, LINE_PROPS } from './line';
import { Arrow, drawArrow, ARROW_PROPS } from './arrow';
import { Text, drawText, TEXT_PROPS } from './text';
import { Textbox, drawTextbox, TEXTBOX_PROPS } from './textbox';
import { Icon, drawIcon, ICON_PROPS } from './icon';
import { Image, drawImage, IMAGE_PROPS } from './image';
import { drawSVG, SVG, SVG_PROPS } from './svg';
export { Tool };
import pick = require('lodash/pick');

const baseProperties = [
    'top',
    'left',
    'angle',
    'scaleX',
    'scaleY',
    'opacity',
    'borderColor',
    'fill',
    'backgroundColor',
    'stroke',
    'strokeWidth',
    'strokeDashArray',
    'strokeLineCap'
];

export class DrawToolsService {
    defaultTools: Tool[] = [
        Circle,
        Triangle,
        Rectangle,
        Text,
        Textbox,
        Arrow,
        Line,
        Icon,
        Image,
        SVG        
    ];

    getToolAction(id: string) {
        switch (id) {
            case 'tool__rect':
                return drawRectangle;

            case 'tool__triangle':
                return drawTriangle;

            case 'tool__circle':
                return drawCircle;

            case 'tool__text':
                return drawText;

            case 'tool__textbox':
                return drawTextbox;

            case 'tool__line':
                return drawLine;

            case 'tool__icon':
                return drawIcon;

            case 'tool__polyline':
                return drawArrow;

            case 'tool__image':
                return drawImage;

            case 'tool__svg':
                return drawSVG;

            default:
                return;
        }
    };

    getProperties(object: any, id: string) {
        let additional = [];
        switch (id) {
            case 'tool__rect':
                additional = RECTANGLE_PROPS;                
                break;

            case 'tool__triangle':
                additional = TRIANGLE_PROPS;
                break;

            case 'tool__circle':
                additional = CIRCLE_PROPS;
                break;

            case 'tool__line':
                additional = LINE_PROPS;
                break;

            case 'tool__text':
                additional = TEXT_PROPS;
                break;

            case 'tool__textbox':
                additional = TEXTBOX_PROPS;
                break;

            case 'tool__icon':
                additional = ICON_PROPS;
                break;

            case 'tool__image':
                additional = IMAGE_PROPS;
                break;

            case 'tool__polyline':
                additional = ARROW_PROPS;
                break;

            case 'tool__svg':
                additional = SVG_PROPS;
                break;

            default:
                return;
        }
        switch (id) {
            case 'tool__svg':
                additional = SVG_PROPS;
                let myprops = [...additional];
                return pick(object, myprops);
            default:
                let props = [...additional, ...baseProperties];
                return pick(object, props);
        }        
    }
}
