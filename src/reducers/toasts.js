import { Map, List } from 'immutable';
import { handleActions } from 'redux-actions';
import { CREATE, REMOVE } from '../actions/toast';

export default handleActions({
    [CREATE]: (state, { payload }) => state.push(new Map(payload)),
    [REMOVE]:
        (state, { payload }) =>
            state.filter((toast) => toast.get('id') !== payload.id),
}, new List());
