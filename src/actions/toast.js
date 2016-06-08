import {createAction} from 'redux-actions';
import {genId} from '../utility/id';

export const CREATE = 'TOAST_CREATE';
export const create = createAction(CREATE, (toast) => ({
    ...toast,
    id: genId(),
}));

export const REMOVE = 'TOAST_REMOVE';
export const remove = createAction(REMOVE, (toast) => toast);
