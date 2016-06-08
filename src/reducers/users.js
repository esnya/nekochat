import { fromJS, List } from 'immutable';
import { handleActions } from 'redux-actions';
import { LIST } from '../actions/user';

export default handleActions({
    [LIST]: (state, { payload }) => fromJS(payload),
}, new List());
