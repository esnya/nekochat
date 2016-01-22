import * as ROOM from '../../constants/RoomActions';

export const roomReducer = function(state = null, action) {
    switch (action.type) {
        case ROOM.JOINED:
            return Object.assign({}, action.room);
        case ROOM.LEAVE:
            return {};
        default:
            return state;
    }
};