import ExpressSocketIOSession from 'express-socket.io-session';
import SocketIO from 'socket.io';
import { gameTypes } from '../actions/dice';
import { getGameTypes } from './bcdice';
import { Connection } from './connection';
import { system as logger } from './logger';
import { server } from './server';
import { session } from './session';
import { getUser } from './user';

logger.info('Socket.IO server starting');
export const io = new SocketIO(server);

io.use(new ExpressSocketIOSession(session, { autoSave: true }));

io.use((socket, next) => {
    getUser(socket.handshake.session)
        .then((user) => {
            // eslint-disable-next-line no-param-reassign
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

    const conn = new Connection(socket, socket.user);

    socket.on('disconnect', () => {
        logger.info('Disconnected', socket.id, socket.user);
        conn.close();
    });

    socket.emit('hello', socket.user);
    socket.emit('action', gameTypes(getGameTypes()));
});
logger.info('Socket.IO server started');
