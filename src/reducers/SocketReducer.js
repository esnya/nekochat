import * as SOCKET from '../contants/SocketActions';

export const socketReducer = (state = {}, action) => {
    switch(action.type) {
        case SOCKET.CONNECT:
            return {
                ...state,
                count: (state.count || 0) + 1,
                connected: true,
            };
        case SOCKET.DISCONNECT:
            return {
                ...state,
                connected: false,
            };
        default:
            return state;
    }
};