import { Action } from 'redux';

export interface Tool<T> {
    name: string,
    displayName: string,
    action: (payload?: T) => ToolAction<T>,
    icon: string
}

export class ToolAction<T> implements Action {
    constructor(public type: string, public payload?: T) {

    }
}
