import ExpressSocketIOSession from 'express-socket.io-session'
import SocketIO from 'socket.io';
import { diceReplace } from './dice';
import { knex } from './knex';
import { server } from './server';
import { session } from './session';

export const io = SocketIO(server);

io.use(ExpressSocketIOSession(session, { autoSave: true }));

io.use(function (socket, next) {
    let passport = socket.handshake.session.passport || {
        user: 'guest',
    };
    if (passport) {
        let user = passport.user;
        if (user) {
            knex('users').where('userid', user)
                .first('userid', 'name')
                .then(function (user) {
                    socket.user = {
                        id: user.userid,
                        name: user.name,
                    };
                    next();
                }).catch(next);
            return;
        }
    }

    //socket.end();
});

io.on('connect', function (socket) {
    console.log('New Connection: ', socket.id);

    var _user, _room, _minId;

    _user = socket.user;

    var createRoom = function (title, game_id, user_id, id) {
        if (!id) {
            id = '' + (new Date).getTime();
        }

        id = crypto.createHash('sha256').update(id).digest('hex').substr(0, 16);

        return knex('rooms')
            .insert({
                id: `#${id}`,
                title: title,
                user_id: _user.id,
            })
            .then(() => knex('rooms').where('id', `#${id}`).whereNull('deleted').first())
            .then(room => room ? Promise.resolve(room) : Promise.reject());
    };

    var sendMessages = function (messages) {
        messages.forEach(function (message) {
            if (_minId == null || message.id < _minId) {
                _minId = message.id;
            }
            socket.emit('add message', message);
        });
    };

    var leaveRoom = function () {
        socket.leave();
        if (_room) {
            io.to(_room.id).emit('user leaved', _user);
        }
    };

    var joinRoom = function (room) {
        if (!_user) return;

        leaveRoom();

        _room = room;

        console.log('Join OK: ', room);
        socket.join(room.id);
        socket.emit('join ok', room);
        io.to(room.id).emit('user joined', _user);

        _minId = null;
        knex('messages').where('room_id', room.id).then(sendMessages);
    };

    var handlers = {
        disconnect: function () {
            console.log('Disconnected: ', socket.id, _user ? _user.id : '');
            leaveRoom();
        },
        'join request': function (room_id) {
            console.log('Join Request: ', socket.id, room_id);

            knex('rooms').where('id', room_id).first()
                .then(room => room
                    ? joinRoom(room)
                    : Promise.reject(new Error('Not Found')))
                .catch(error => {
                    console.error('Join Request Error: ', error);
                    socket.emit('join failed');
                });
        },
        'create room': function (title) {
            console.log('Create Room: ', _user.id, title);
            if (!_user) return;
            createRoom(title, _user.id).catch(function (error) {
                console.log('Create Failed: ', error);
                socket.emit('create room failed');
            }).then(function (room) {
                leaveRoom();
                joinRoom(room);
            });
        },
        'message request': function () {
            if (!_user || !_room) return;
            console.log('Message Request: ', _user.id, _room.id);
            knex('messages')
                .where('room_id', _room.id)
                .where('id', '>', _minId)
                .whereNull('deleted')
                .then(sendMessages);
        },
        'leave': function () {
            if (!_user) return;
            console.log('Leave: ', _user.id, _room ? _room.id : '');
            leaveRoom();
        },
        'room list': function () {
            if (!_user) return;
            console.log('Room List: ', _user.id);
            knex('rooms')
                .where('user_id', _user.id)
                .whereNull('deleted')
                .then(rooms => socket.emit('room list', rooms));
        },
        'room history': function () {
            if (!_user) return;
            console.log('History: ', _user.id);
            knex('room_histories')
                .where('user_id', _user.id)
                .whereNull('deleted')
                .then(rooms => socket.emit('room history', rooms));
        },
        'add message': function (message) {
            if (!_user || !_room) return;

            console.log('Add Message: ', _user.id, _room.id);
            var msg = {
                name: message.name,
                room_id: _room.id,
                user_id: _user.id,
                message: diceReplace(message.message, io.to(_room.id)),
                character_url: message.character_url,
                icon_id: message.icon_id
            };

            msg.created = msg.modified = new Date();
            knex('messages').insert(msg, 'id').then(function (ids) {
                return knex('messages').where('id', ids[0] || ids).whereNull('deleted').first()
                    .then(message => message ? Promise.resolve(message) : Promise.reject());
            }).then(function (message) {
                io.to(_room.id).emit('add message', message);
            });
        },
        'begin writing': function (name) {
            if (!_room) return;
            io.to(_room.id).emit('begin writing', _user.id, name);
        },
        'end writing': function () {
            if (!_room) return;
            io.to(_room.id).emit('end writing', _user.id);
        },
        'writing_message': function (message) {
            if (!_room) return;
            io.to(_room.id).emit('writing_message', _user, message ? {
                user_id: _user.id,
                name: message.name,
                message: message.message,
                character_url: message.character_url,
                icon_id: message.icon,
                created: new Date
            } : null);
        },
        'remove room': function (room_id) {
            knex('rooms')
                .where('id', room_id)
                .where('user_id', _user.id)
                .whereNull('deleted')
                .update('deleted', knex.fn.now())
                .then(removed => console.log(removed))
                .then(socket.emit('room removed', room_id));
        },
        'add icon': function (name, type, data) {
            //console.log(name);
            //console.log(type);
            //console.log(data.length);

            if (data.length <= 1024 * 512 && ("" + type).match(/^image/)) {
                var id = crypto.createHash('sha256').update(name + _user.id + Date.now()).digest('hex').substr(0, 16);
                knex('icons').insert({
                    id: id,
                    user_id: _user.id,
                    name: name,
                    type: type,
                    data: data
                }).then(() => socket.emit('icon added'));
            } else {
                socket.emit('adding icon failed');
            }
        },
        'get icons': function () {
            knex('icons')
                .where('user_id', _user.id)
                .whereNull('deleted')
                .then(icons => socket.emit('icons', icons));
        },
        'get icon': function (id) {
            knex('icons')
                .where('id', id)
                .whereNull('deleted')
                .first()
                .then(icon => icon
                    ? socket.emit('icon', icon.id, icon.name, icon.type, icon.data)
                    : Promise.reject(new Error('Not found')));
        }
    };
    Object.keys(handlers).forEach(e => 
        socket.on(e, (...args) => {
            console.log('Socket event:', e, args);
            handlers[e](...args);
        })
    );

    socket.emit('hello', _user);
});
