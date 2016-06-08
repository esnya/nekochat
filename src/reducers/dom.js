import { Map } from 'immutable';
import { handleActions } from 'redux-actions';
import { FOCUS, BLUR } from '../actions/dom';

export default handleActions({
    [FOCUS]: (state) => state.set('focused', true),
    [BLUR]: (state) => state.set('focused', false),
}, new Map({ focused: true }));
