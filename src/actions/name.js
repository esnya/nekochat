import {createAction} from 'redux-actions';
import {genId} from '../utility/id';

export const CREATE = 'NAME_CREATE';
export const create = createAction(CREATE, (name) => ({
    ...name,
    id: genId(),
}));

export const UPDATE = 'NAME_UPDATE';
export const update = createAction(UPDATE, (name) => name);

export const REMOVE = 'NAME_REMOVE';
export const remove = createAction(REMOVE, (name) => name);
