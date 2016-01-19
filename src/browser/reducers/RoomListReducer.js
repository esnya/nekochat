import * as ROOM_LIST from '../../constants/RoomListActions';

const InitialState = {
    rooms: [],
    history: [],
};
export const roomListReducer = function(state = InitialState, action) {
    switch (action.type) {
        case ROOM_LIST.PUSH:
            return {
                ...state,
                rooms: [...action.rooms, ...(state.rooms.filter(a => !action.rooms.find(b => a.id == b.id)))],
            };
        case ROOM_LIST.PUSH_HISTORY:
            return {
                ...state,
                history: [...action.history, ...(state.history.filter(a => !action.history.find(b => a.id == b.id)))],
            };
        default:
            return state;
    }
};