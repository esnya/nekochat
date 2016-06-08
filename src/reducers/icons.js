import { fromJS, List, Map } from 'immutable';
import { handleActions } from 'redux-actions';
import { CREATE, REMOVE, BULK_REMOVE, LIST } from '../actions/icon';

const remove = (state, test) => state.filter(test);

export default handleActions({
    [CREATE]: (state, { payload }) => !payload.id
        ? state
        : state.unshift(new Map(payload)),
    [REMOVE]:
        (state, { payload }) =>
            remove(state, (icon) => icon.get('id') !== payload.id),
    [BULK_REMOVE]:
        (state, { payload }) =>
            remove(
                state,
                (icon) => !payload.find(({ id }) => id === icon.get('id'))
            ),
    [LIST]: (state, { payload }) => fromJS(payload),
}, new List());
