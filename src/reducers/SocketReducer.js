import { socket } from '../socket';

export const socketReducer = function(state = {}, action) {
    const {
        server,
        ...others,
    } = action;

    if (server) {
        socket.emit('action', others);
    }
    
    return state;
};