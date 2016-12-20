import { Action } from 'redux';
import { type } from './utilities';

export const DrawActions = {
    SWITCH_TOOL: type<'SWITCH_TOOL'>('[Draw] Switch Tool'),
    UPDATE_PROPERTIES: type<'UPDATE_PROPERTIES'>('[Draw] Update Properties'),
    SHAPE_DRAWN: type<'SHAPE_DRAWN'>('[Draw] Shape Drawn'),
    UNDO: type<'UNDO'>('[Draw] Undo'),
    REDO: type<'REDO'>('[Draw] Redo')
};

export class SwitchToolAction implements Action {
    type = DrawActions.SWITCH_TOOL;
    constructor(public payload: fabric.IObject) { }
}

export class UpdateProperties implements Action {
    type = DrawActions.UPDATE_PROPERTIES;
    constructor(public payload: fabric.IObjectOptions) { }
}

export class ShapeDrawnAction implements Action {
    type = DrawActions.SHAPE_DRAWN;
    constructor(public payload: fabric.IObject) { }
}

export class UndoAction implements Action {
    type = DrawActions.UNDO;
    constructor() { }
}

export class RedoAction implements Action {
    type = DrawActions.REDO;
    constructor() { }
}

export type DrawActionTypes =
    SwitchToolAction
    | UpdateProperties
    | ShapeDrawnAction
    | UndoAction
    | RedoAction;
