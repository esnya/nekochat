import { handleActions } from 'redux-actions';
import * as Actions from '../actions/dice';

export default handleActions({
    [Actions.GAME_TYPES]: (state, action) => action.payload,
}, []);
