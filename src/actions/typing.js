import { createAction } from 'redux-actions';

const sync = () => ({ sync: true });

export const UPDATE = 'TYPING_UPDATE';
export const update =
    createAction(UPDATE, (typing) => (typing), sync);
