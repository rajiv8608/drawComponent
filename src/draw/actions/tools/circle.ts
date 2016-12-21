import { Action } from 'redux';
import { Tool, ToolAction, Color } from '../../models';

const circleDefaults: fabric.ICircleOptions = {
    radius: 20,
    borderColor: 'transparent',
    fill: new Color('#FF4444').hex
};

export const DrawCircle = (circle: fabric.ICircleOptions) => {
    return new ToolAction<fabric.ICircleOptions>(
        '[Tool] Circle',
        circle || circleDefaults
    );
};

export const Circle: Tool<fabric.ICircleOptions> = {
    name: 'circle',
    displayName: 'Draw Circle',
    action: DrawCircle,
    icon: 'CircleRing'
};

export const CircleReducer = (state: any, action: ToolAction<any>) => {
    switch (action.type) {
        case '[Tool] Circle':
            // Draw the circle here
            // get the drawn circle and store it into objects
            // update the undo/redo stack
            const name = {};
            break;

        default: return state;
    }
}