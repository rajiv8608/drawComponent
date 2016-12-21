export interface ITool {
    id: string,
    name: string,
    icon: string
}

const Circle: ITool = {
    id: 'tool__rectangle',
    name: 'Draw Circle',
    icon: 'CircleRing'
};

const Line: ITool = {
    id: 'tool__line',
    name: 'Draw Line',
    icon: 'CalculatorSubtract'
};

const Polyline: ITool = {
    id: 'tool__polyline',
    name: 'Draw Polyline',
    icon: 'Flow'
};

const Polygon: ITool = {
    id: 'tool__polygon',
    name: 'Draw Polygon',
    icon: 'Section'
};

const Rectangle: ITool = {
    id: 'tool__rectangle',
    name: 'Draw Rectangle',
    icon: 'Checkbox'
};

const Triangle: ITool = {
    id: 'tool__triangle',
    name: 'Draw Triangle',
    icon: 'TriangleUp12'
};

const Image: ITool = {
    id: 'tool__image',
    name: 'Draw Image',
    icon: 'Photo2'
};

const Text: ITool = {
    id: 'tool__text',
    name: 'Draw Text',
    icon: 'InsertTextBox'
};

const Icon: ITool = {
    id: 'tool__icon',
    name: 'Draw Icon',
    icon: 'CirclePlus'
};

export const DEFAULT_TOOLS = [
    Circle,
    Line,
    Polyline,
    Polygon,
    Rectangle,
    Triangle,
    Image,
    Text,
    Icon
];
