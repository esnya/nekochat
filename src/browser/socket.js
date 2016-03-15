import io from 'socket.io-client';
import * as Socket from '../actions/SocketActions';
import { AppStore } from '../stores/AppStore';

export const socket = io.connect();

socket.on('connect', () => AppStore.dispatch(Socket.connect()));
socket.on('disconnect', () => AppStore.dispatch(Socket.disconnect()));
socket.on('action', (action) => AppStore.dispatch(action));
