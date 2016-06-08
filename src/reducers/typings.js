import { Map } from 'immutable';
import { handleActions } from 'redux-actions';
import { UPDATE } from '../actions/typing';

export default handleActions({
    [UPDATE]:
        (state, { payload, meta }) => {
            if (!meta || !meta.sender) return state;

            if (!payload.message) return state.delete(meta.sender);

            return state.set(meta.sender, new Map(payload));
    },
}, new Map());
