import { createAction } from 'redux-actions';

export const ROLL = 'DICE_ROLL';
export const roll = createAction(ROLL, ({ faces, results }) => ({ faces, results }));

export const GAME_TYPES = 'GAME_TYPES';
export const gameTypes = createAction(GAME_TYPES, (types) => types);
