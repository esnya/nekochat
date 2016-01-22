import * as ROOM from '../../constants/RoomActions';
import * as MESSAGE from '../../constants/MessageActions';

export const roomReducer = function(state = null, action) {
    switch (action.type) {
        case ROOM.JOINED:
            return Object.assign({}, action.room);
        case MESSAGE.PUSH:
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