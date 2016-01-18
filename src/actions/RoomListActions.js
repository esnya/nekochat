import * as ROOM_LIST from '../constants/RoomListActions';

export const fetch = function() {
    return {
        type: ROOM_LIST.FETCH,
        server: true,
    };
};

export const push = function(items) {
    return {
        type: ROOM_LIST.PUSH,
        items,
    };
};