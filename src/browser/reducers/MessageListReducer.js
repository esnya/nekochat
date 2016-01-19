import * as MESSAGE_LIST from '../../constants/MessageListActions';
import * as ROOM from '../../constants/RoomActions';

export const messageListReducer = function(state = [], action) {
    switch (action.type) {
        case ROOM.JOINED:
        case ROOM.LEAVE:
            return [];
        case MESSAGE_LIST.PUSH:
            return [...action.items, ...(state.filter(a => !action.items.find(b => a.id == b.id)))];
        default:
            return state;
    }
};