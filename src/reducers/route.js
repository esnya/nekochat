import { fromJS, Map } from 'immutable';
import { handleActions } from 'redux-actions';
import { SET } from '../actions/route';

export default handleActions({
    [SET]:
        (state, { payload }) => !payload.route ? state : fromJS(payload.route),
}, new Map());
