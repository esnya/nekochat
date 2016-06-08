import { fromJS, Map, List } from 'immutable';
import { handleActions } from 'redux-actions';
import { CREATE, REMOVE, LIST } from '../actions/room';

export default handleActions({
    [CREATE]:
        (state, { payload }) =>
            !payload.id ? state : state.unshift(new Map(payload)),
    [REMOVE]:
        (state, { payload }) =>
            state.filter((room) => room.get('id') !== payload.id),
    [LIST]: (state, { payload }) => fromJS(payload),
}, new List());
