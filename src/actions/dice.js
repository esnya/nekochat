import {createAction} from 'redux-actions';

export const ROLL = 'DICE_ROLL';
export const roll = createAction(ROLL, (faces, results) => ({faces, results}));
