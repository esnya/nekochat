import crypto from 'crypto';
import ExpressSocketIOSession from 'express-socket.io-session'
import SocketIO from 'socket.io';
import { loggedin } from '../actions/UserActions';
import { server } from './server';
import { session } from './session';
import { ActionDispatcher } from './dispatchers/ActionDispatcher';
import { getUser } from './user';

export const io = SocketIO(server);

io.use(ExpressSocketIOSession(session, { autoSave: true }));

io.use(function (socket, next) {
    getUser(socket.handshake.session)
        .then(user => {
            socket.user = {
                id: user.id,
                name: user.name,
            };
            next();
        })
        .catch(next);
});

io.on('connect', function (socket) {
    console.log('New Connection: ', socket.id, socket.user);

    let dispatcher = new ActionDispatcher(socket);
    socket.on('action', action => dispatcher.onDispatch(action));

    socket.emit('hello', socket.user);
    socket.emit('action', loggedin(socket.user));
});
