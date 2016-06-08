import {icon} from './icon';
import {typing} from './typing';
import {message} from './message';
import {room} from './room';

const handlers = [
    icon,
    typing,
    message,
    room,
];

const handleImpl = (handlers, action, next) =>
    handlers[0](
        handlers.length > 1
            ? (nextAction) => handleImpl(handlers.slice(1), nextAction, next)
            : next
    )(action);

export const handle = (client) => (next) => (action) =>
    handleImpl(handlers.map((handler) => handler(client)), action, next);
