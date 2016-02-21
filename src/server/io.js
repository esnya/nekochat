import ExpressSocketIOSession from 'express-socket.io-session';
import { getLogger } from 'log4js';
import SocketIO from 'socket.io';
import { loggedin } from '../actions/UserActions';
import { notify } from '../actions/NotificationActions';
import { ActionDispatcher } from './dispatchers/ActionDispatcher';
import { server } from './server';
import { session } from './session';
import { getUser } from './user';

const logger = getLogger('[SOCKET]');

export const io = SocketIO(server);

io.use(ExpressSocketIOSession(session, { autoSave: true }));

io.use((socket, next) => {
    getUser(socket.handshake.session)
        .then((user) => {
            socket.user = {
                id: user.id,
                name: user.name,
            };
            next();
        })
        .catch(next);
});

io.on('connect', (socket) => {
    logger.info('New Connection: ', socket.id, socket.user);
    socket.on('disconnect', () =>
        logger.info('Disconnected', socket.id, socket.user));

    const dispatcher = new ActionDispatcher(socket);

    socket.on('action', (action) =>
        dispatcher.onDispatch(action)
            .catch((e) => {
                logger.error(e);
                socket.emit('action', notify({
                    message: `${e}`,
                }));
            })
    );

    socket.emit('hello', socket.user);
    socket.emit('action', loggedin(socket.user));
});
