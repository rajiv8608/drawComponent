import { Tool, ToolAction, Color } from '../../models';

const rectangleDefaults: fabric.IRectOptions = {
    width: 30,
    height: 15,
    rx: 0,
    ry: 0,
    borderColor: 'transparent',
    fill: new Color('#FF4444').hex
};

export const DrawRectangle = (rectangle: fabric.IRectOptions) => {
    return new ToolAction<fabric.IRectOptions>(
        '[Tool] Rectangle',
        rectangle || rectangleDefaults
    );
};

export const Rectangle: Tool<fabric.IRectOptions> = {
    name: 'rectangle',
    displayName: 'Draw Rectangle',
    action: DrawRectangle,
    icon: 'Checkbox'
};
