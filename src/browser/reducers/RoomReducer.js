import * as ROOM from '../../constants/RoomActions';

export const roomReducer = function(state = null, action) {
    switch (action.type) {
        case ROOM.CREATED:
            setTimeout(() => location.hash = action.room.id);
            return state;
        case ROOM.JOINED:
            return Object.assign({}, action.room);
        default:
            return state;
    }
};