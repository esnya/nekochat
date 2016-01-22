import * as ROOM from '../../constants/RoomActions';

const InitialState = {
    rooms: [],
    history: [],
};
export const roomListReducer = function(state = InitialState, action) {
    switch (action.type) {
        case ROOM.PUSH:
            return {
                ...state,
                rooms: [...action.rooms, ...(state.rooms.filter(a => !action.rooms.find(b => a.id == b.id)))],
            };
        case ROOM.PUSH_HISTORY:
            return {
                ...state,
                history: [...action.history, ...(state.history.filter(a => !action.history.find(b => a.id == b.id)))],
            };
        case ROOM.REMOVE:
            return {
                ...state,
                rooms: state.rooms.filter(room => room.id != action.id),
                history: state.history.filter(room => room.id != action.id),
            };
        default:
            return state;
    }
};