import {icon} from './icon';
import {input} from './input';
import {message} from './message';
import {room} from './room';

const handlers = [
    icon,
    input,
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
