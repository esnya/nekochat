import {createAction} from 'redux-actions';

const sync = () => ({sync: true});

export const UPDATE = 'MEMO_UPDATE';
export const update = createAction(UPDATE, (memo) => memo, sync);
