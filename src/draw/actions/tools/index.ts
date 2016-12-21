import { Tool } from '../../models';
import { Circle } from './circle';
import { Triangle } from './triangle';
import { Rectangle } from './rectangle';

export * from './circle';
export * from './rectangle';
export * from './triangle';

export const TOOLS: Tool<any>[] = [
    Circle,
    Triangle,
    Rectangle
];
