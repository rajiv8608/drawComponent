import { DrawModule } from '../module';
import { Tool } from '../models';
import { Circle, drawCircle, CIRCLE_PROPS } from './circle';
import { Triangle, drawTriangle, TRIANGLE_PROPS } from './triangle';
import { Rectangle, drawRectangle, RECTANGLE_PROPS } from './rectangle';
import { Line, drawLine, LINE_PROPS } from './line';
import { Text, drawText, TEXT_PROPS } from './text';
import { Icon, drawIcon, ICON_PROPS } from './icon';
import { Image, IMAGE_PROPS } from './image';
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
        Icon,
        Image,
        {
            icon: 'Save',
            id: 'tool__save',
            name: 'Export to SVG'
        },
        {
            icon: 'OpenFile',
            id: 'tool__load',
            name: 'Import from SVG'
        }
    ];

    getToolAction(id: string) {
        switch (id) {
            case 'tool__rectangle':
                return drawRectangle;

            case 'tool__triangle':
                return drawTriangle;

            case 'tool__circle':
                return drawCircle;

            case 'tool__text':
                return drawText;

            case 'tool__icon':
                return drawIcon;

            default:
                return;
        }
    };

    getProperties(object: any, id: string) {
        let additional = [];
        switch (id) {
            case 'tool__rectangle':
                additional = RECTANGLE_PROPS;
                break;

            case 'tool__triangle':
                additional = TRIANGLE_PROPS;
                break;

            case 'tool__circle':
                additional = CIRCLE_PROPS;
                break;

            case 'tool__text':
                additional = TEXT_PROPS;
                break;

            case 'tool__icon':
                additional = ICON_PROPS;
                break;

            case 'tool__image':
                additional = IMAGE_PROPS;
                break;

            default:
                return;
        }

        let props = [...additional, ...baseProperties];
        return pick(object, props);
    }
}
