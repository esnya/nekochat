import * as ROOM_LIST from '../constants/RoomListActions';

export const roomList = function(state = [], action) {
    let {
        type,
        ...props,
    } = action;
    
    switch (type) {
        case ROOM_LIST.PUSH:
            return [...props.items, ...state];
        default:
            return state;
    }
};