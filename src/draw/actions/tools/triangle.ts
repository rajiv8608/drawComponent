import { Tool, ToolAction, Color } from '../../models';

const triangeDefaults: fabric.ITriangleOptions = {
    width: 30,
    height: 15,
    borderColor: 'transparent',
    fill: new Color('#FF4444').hex
};

export const DrawTriangle = (triangle: fabric.ITriangleOptions) => {
    return new ToolAction<fabric.ITriangleOptions>(
        '[Tool] Triangle',
        triangle || triangeDefaults
    );
};

export const Triangle: Tool<fabric.ITriangleOptions> = {
    name: 'triangle',
    displayName: 'Draw Triangle',
    action: DrawTriangle,
    icon: 'TriangleUp12'
};