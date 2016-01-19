import * as ROOM from '../../constants/RoomActions';

export const roomReducer = function(state = null, action) {
    let {
        type,
        ...props,
    } = action;
    
    switch (type) {
        case ROOM.JOINED:
            location.hash = props.room.id;
            return Object.assign({}, props.room);
        default:
            return state;
    }
};