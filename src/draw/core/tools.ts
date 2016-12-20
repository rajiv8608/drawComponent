export interface ITool {
    id: string,
    name: string,
    icon: string
}

const Rectangle: ITool = {
    id: 'tool__rectangle',
    name: 'Draw Rectangle',
    icon: 'Checkbox'
};

export const DEFAULT_TOOLS = [
    Rectangle
];
