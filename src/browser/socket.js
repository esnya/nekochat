import io from 'socket.io-client';
import {
    connect,
    disconnect,
    reconnect,
} from '../actions/socket';
import Store from './store';

const socket = io.connect();
export default socket;

socket.on('connect', () => Store.dispatch(connect()));
socket.on('disconnect', () => Store.dispatch(disconnect()));
socket.on('reconnect', () => Store.dispatch(reconnect()));
socket.on('action', (action) => Store.dispatch(action));
