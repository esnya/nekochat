import {createAction} from 'redux-actions';
import {genId} from '../utility/id';

export const OPEN = 'DIALOG_OPEN';
export const open = createAction(OPEN, (type, dialog) => ({
    ...dialog,
    type,
    id: genId(),
}));

export const OK = 'DIALOG_OK';
export const ok = createAction(OK, (id) => id);

export const CLOSE = 'DIALOG_CLOSE';
export const close = createAction(CLOSE, (id) => id);
