import { Map } from 'immutable';
import { handleActions } from 'redux-actions';
import { SET } from '../actions/route';
import { DRAWER } from '../actions/ui';

export default handleActions({
    [DRAWER]: (state, { payload }) => state.set('drawer', payload),
    [SET]: (state) => state.set('drawer', false),
}, new Map({ drawer: false }));
