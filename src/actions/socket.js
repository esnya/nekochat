import { createAction } from 'redux-actions';

export const CONNECT = 'SOCKET_CONNECT';
export const connect = createAction(CONNECT);

export const DISCONENCT = 'SOCKET_DISCONNECT';
export const disconnect = createAction(DISCONENCT);

export const RECONNECT = 'SOCKET_RECONNECT';
export const reconnect = createAction(RECONNECT);
