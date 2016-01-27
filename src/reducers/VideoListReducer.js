import * as VIDEO from '../constants/VideoActions';
import * as ROOM from '../constants/RoomActions';

export const videoListReducer = (state = [], action) => {
    switch (action.type) {
        case VIDEO.PUSH:
            if (!action.stream) return state;
            return [
                {
                    id: action.id,
                    stream: action.stream,
                },
                ...state,
            ];
        case VIDEO.REMOVE:
        case VIDEO.REMOVED:
            return state.filter((video) => video.id !== action.id);
        case ROOM.JOIN:
        case ROOM.LEAVE:
            return [];
        default:
            return state;
    }
};