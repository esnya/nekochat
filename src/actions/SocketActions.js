import * as SOCKET from '../constants/SocketActions';

export const connect = () => ({
    type: SOCKET.CONNECT,
});

export const disconnect = () => ({
    type: SOCKET.DISCONNECT,
});
