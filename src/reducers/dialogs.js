import { List, Map } from 'immutable';
import { handleActions } from 'redux-actions';
import { OPEN, OK, CLOSE } from '../actions/dialog';

const removeDialog =
    (state, { payload }) =>
        state.filter((dialog) => dialog.get('id') !== payload);

export default handleActions({
    [OPEN]: (state, { payload }) => state.unshift(new Map(payload)),
    [OK]: removeDialog,
    [CLOSE]: removeDialog,
}, new List());
