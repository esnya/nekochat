import { fromJS, List } from 'immutable';
import { handleActions } from 'redux-actions';
import { CREATE, LIST, OLD } from '../actions/message';
import { LEAVE } from '../actions/room';

export default handleActions({
    [CREATE]:
        (state, { payload }) =>
            !payload.id ? state : state.push(fromJS(payload)),
    [LIST]: (state, { payload }) => fromJS(payload),
    [OLD]: (state, { payload }) => fromJS(payload).concat(state),
    [LEAVE]: (state) => state.clear(),
}, new List());
