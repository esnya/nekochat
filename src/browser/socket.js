import io from 'socket.io-client';
import dice3d from 'dice3d';
import { AppStore } from './stores/AppStore';
import { run } from './router';

export const socket = io.connect();
socket.on('connect', () => run());
socket.on('action', action => AppStore.dispatch(action));

let diceCounter = 0;
socket.on('dice', (faces, results) => {
    results.forEach(result => {
        if (diceCounter > 20) return;
        diceCounter++;
        dice3d(faces, result, () => diceCounter--);
    });
});