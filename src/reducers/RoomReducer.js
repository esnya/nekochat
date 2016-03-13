import { pick } from 'lodash';
import * as ROOM from '../constants/RoomActions';
import * as MESSAGE from '../constants/MessageActions';

export const roomReducer = function(state = null, action) {
    switch (action.type) {
        case ROOM.UPDATED:
            return {
                ...state,
                ...pick(action, ['title']),
            };
        case ROOM.JOINED:
            return Object.assign({}, action.room);
        case MESSAGE.PREPEND_LIST:
            if (action.items.length > 0) return state;

            return Object.assign({}, state, {
                eor: true,
            });
        case ROOM.LEAVE:
            return {};
        default:
            return state;
    }
};
