import * as ROOM_LIST from '../../constants/RoomListActions';

const InitialState = {
    rooms: [],
    history: [],
};
export const roomListReducer = function(state = InitialState, action) {
    let {
        type,
        ...props,
    } = action;
    
    console.log('RoomListReducer', state, action);
    
    switch (type) {
        case ROOM_LIST.PUSH:
            return {
                ...state,
                rooms: [...props.rooms, ...(state.rooms.filter(a => !props.rooms.find(b => a.id == b.id)))],
            };
        case ROOM_LIST.PUSH_HISTORY:
            return {
                ...state,
                history: [...props.history, ...(state.history.filter(a => !props.history.find(b => a.id == b.id)))],
            };
        default:
            return state;
    }
};