import { Iterable } from 'immutable';
import createLogger from 'redux-logger';
import promise from 'redux-promise';
import localStorage from '../browser/localStorage';
import dialog from './dialog';
import dice from './dice';
import notification from './notification';
import router from './router';
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
    router,
    socket,
    sound,
    toast,
];

if (localStorage.getItem('nekochat:debug')) {
    middlewares.push(createLogger({
        stateTransformer:
            (state) => Object.keys(state).reduce((result, key) => {
                const value = state[key];
                result[key] =
                    Iterable.isIterable(value) ? value.toJS() : value;

                return result;
            }, {}),
    }));
}

export default middlewares;
