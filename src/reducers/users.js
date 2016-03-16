import * as ROOM from '../constants/RoomActions';

export const users = (state = [], action) => {
    switch (action.type) {
        case ROOM.JOIN:
        case ROOM.LEAVE:
            return [];
        case ROOM.USER_LIST:
            return [...action.users];
    }

    return state;
};
