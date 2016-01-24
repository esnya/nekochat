import ExpressSocketIOSession from 'express-socket.io-session';
import SocketIO from 'socket.io';
import { loggedin } from '../actions/UserActions';
import { create as createSnack } from '../actions/SnackActions';
import { ActionDispatcher } from './dispatchers/ActionDispatcher';
import { logger } from './logger';
import { server } from './server';
import { session } from './session';
import { getUser } from './user';

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

    const dispatcher = new ActionDispatcher(socket);

    socket.on('action', (action) => 
        dispatcher.onDispatch(action)
            .catch((e) => {
                logger.error(e);
                if (typeof(e) === 'string') {
                    socket.emit('action', createSnack({
                        message: e,
                    }));
                }
            })
    );

    socket.emit('hello', socket.user);
    socket.emit('action', loggedin(socket.user));
});
