import { Reducer } from 'redux';
import { DrawActions, DrawActionTypes } from './actions';

export interface IDrawState {

};

const initialState: IDrawState = {

};

export const reducer: Reducer<IDrawState> = <DrawActionTypes>(state: IDrawState = initialState, action) => {
    switch (action.type) {
        case DrawActions.SHAPE_DRAWN:
            return;

        case DrawActions.UPDATE_PROPERTIES:
            return;

        case DrawActions.SHAPE_DRAWN:
            return;

        case DrawActions.UNDO:
            return;

        case DrawActions.REDO:
            return;

        default:
            return state;
    }
};
