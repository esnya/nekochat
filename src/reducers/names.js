import { List, Map } from 'immutable';
import { handleActions } from 'redux-actions';
import { CREATE, UPDATE, REMOVE } from '../actions/name';
import { JOIN } from '../actions/room';
import User from '../browser/user';
import { load } from '../middlewares/persistent';

export const INITIAL_NAME_ID = 'DEFAULT';
const INITIAL_NAME = new Map({ id: INITIAL_NAME_ID, name: User.name });
const INITIAL_STATE = new List([INITIAL_NAME]);

export default handleActions({
    [CREATE]: (state, { payload }) => state.push(new Map(payload)),
    [UPDATE]: (state, { payload }) =>
        state.map(
            (name) => name.get('id') === payload.id ? new Map(payload) : name
        ),
    [REMOVE]: (state, { payload }) => {
        if (state.size > 1) {
            return state.filter((name) => name.get('id') !== payload.id);
        }

        return INITIAL_STATE;
    },
    [JOIN]: (state, { payload }) => payload.id
        ? load(`nekochat:${payload.id}:names`, INITIAL_STATE)
        : state,
}, INITIAL_STATE);
