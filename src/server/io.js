import ExpressSocketIOSession from 'express-socket.io-session';
import { getLogger } from 'log4js';
import SocketIO from 'socket.io';
import { Connection } from './connection';
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

    const conn = new Connection(socket, socket.user);

    socket.on('disconnect', () => {
        logger.info('Disconnected', socket.id, socket.user);
        conn.close();
    });

    socket.emit('hello', socket.user);
});
