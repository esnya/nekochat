import { Map } from 'immutable';
import { handleActions } from 'redux-actions';
import { DRAWER } from '../actions/ui';

export default handleActions({
    [DRAWER]: (state, { payload }) => state.set('drawer', payload),
}, new Map({ drawer: false }));
