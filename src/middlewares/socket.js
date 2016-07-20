import socket from '../browser/socket';

export default () => (next) => (action) => {
    if (action.meta && action.meta.sync) socket.emit('action', action);

    return next(action);
};
