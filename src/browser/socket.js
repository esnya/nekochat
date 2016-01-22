import io from 'socket.io-client';
import { AppStore } from './stores/AppStore';
import { run } from './router';

export const socket = io.connect();
socket.on('connect', () => run());
socket.on('action', action => AppStore.dispatch(action));