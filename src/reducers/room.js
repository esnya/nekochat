import { Map } from 'immutable';
import { handleActions } from 'redux-actions';
import { JOIN, UPDATE, LEAVE } from '../actions/room';

const update =
    (state, { payload }) =>
        new Map({
            ...payload,
            id: payload.id || state.get('id'),
            password: Boolean(payload.password),
        });

export default handleActions({
    [JOIN]: update,
    [UPDATE]: update,
    [LEAVE]: (state) => state.clear(),
}, new Map());
