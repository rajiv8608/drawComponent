import { Tool } from '../models';
import { Circle } from './circle';
import { Triangle } from './triangle';
import { Rectangle, drawRectangle } from './rectangle';
import { Line } from './line';
import { Polyline } from './polyline';
import { Text } from './text';
import { Icon } from './icon';
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

        default:
            console.log(`tool ins't implemented yet`);
            return;
    }
};
