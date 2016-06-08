import { createAction } from 'redux-actions';
import { get as getCharacter } from '../browser/character';

export const GET = 'CHARACTER_GET';
export const get = createAction(GET, (url) => getCharacter(url));

export const REMOVE = 'CHARACTER_REMOVE';
export const remove = createAction(REMOVE);
