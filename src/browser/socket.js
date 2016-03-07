import io from 'socket.io-client';
import dice3d from 'dice3d';
import * as Socket from '../actions/SocketActions';
import { AppStore } from '../stores/AppStore';

const DICE_MAX = 20;

export const socket = io.connect();

socket.on('connect', () => AppStore.dispatch(Socket.connect()));
socket.on('disconnect', () => AppStore.dispatch(Socket.disconnect()));
socket.on('action', (action) => AppStore.dispatch(action));

let diceCounter = 0;

socket.on('dice', (faces, results) => {
    results.forEach((result) => {
        if (diceCounter > DICE_MAX) return;
        diceCounter++;
        dice3d(faces, result, () => diceCounter--);
    });
});
