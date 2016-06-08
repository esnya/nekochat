import { createAction } from 'redux-actions';

export const FOCUS = 'DOM_FOCUS';
export const focus = createAction(FOCUS);

export const BLUR = 'DOM_BLUR';
export const blur = createAction(BLUR);
