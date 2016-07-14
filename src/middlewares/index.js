import { Iterable } from 'immutable';
import createLogger from 'redux-logger';
import promise from 'redux-promise';
import config from '../browser/config';
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

if (config.debug) {
    middlewares.push(createLogger({
        stateTransformer:
            (state) => Object.keys(state).reduce((result, key) => {
                const value = state[key];
                // eslint-disable-next-line no-param-reassign
                result[key] =
                    Iterable.isIterable(value) ? value.toJS() : value;

                return result;
            }, {}),
    }));
}

export default middlewares;
