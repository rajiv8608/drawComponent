import { Tool } from '../models';
import { Circle, drawCircle } from './circle';
import { Triangle, drawTriangle } from './triangle';
import { Rectangle, drawRectangle } from './rectangle';
import { Line, drawLine } from './line';
import { Polyline, drawPolyline } from './polyline';
import { Text, drawText } from './text';
import { Icon, drawIcon } from './icon';
import { Image } from './image';

export const DEFAULT_TOOLS: Tool[] = [
    Circle,
    Triangle,
    Rectangle,
    Line,
    Polyline,
    Text,
    Icon,
    Image
];


export const getToolAction = (id: string) => {
    switch (id) {
        case 'tool__rectangle':
            return drawRectangle;

        case 'tool__triangle':
            return drawTriangle;

        case 'tool__circle':
            return drawCircle;

        case 'tool__line':
            return drawLine;

        case 'tool__polyline':
            return drawPolyline;

        case 'tool__text':
            return drawText;

        case 'tool__icon':
            return drawIcon;

        default:
            console.log(`tool ins't implemented yet`);
            return;
    }
};
