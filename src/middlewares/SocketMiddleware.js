import { socket } from '../browser/socket';

export const socketMiddleware = ({}) => (next) => (action) => {
    const {
        server,
        ...toEmit,
    } = action;

    if (server) socket.emit('action', toEmit);

    return next(action);
};