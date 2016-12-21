import { Reducer } from 'redux';

export interface IDrawState {

};

const initialState: IDrawState = {

};

export const reducer: Reducer<IDrawState> = (state: IDrawState = initialState, action) => {
    switch (action.type) {
        case 'SELECT_TOOL':
            console.log(action.payload);
            return;

        case 'UPDATE_PROPERTIES':
            return;

        case 'SHAPE_DRAWN':
            return;

        case 'UNDO':
            return;

        case 'REDO':
            return;

        default:
            return state;
    }
};
