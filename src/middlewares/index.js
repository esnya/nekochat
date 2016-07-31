import promise from 'redux-promise';
import dialog from './dialog';
import dice from './dice';
import notification from './notification';
import routing from './routing';
import socket from './socket';
import sound from './sound';
import persistent from './persistent';
import toast from './toast';

const middlewares = [
    persistent('names', 'nekochat:${room.get("id")}:names'),
    promise,
    dialog,
    dice,
    notification,
    routing,
    socket,
    sound,
    toast,
];

export default middlewares;
