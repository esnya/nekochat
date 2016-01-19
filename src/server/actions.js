import crypto from 'crypto';
import * as Room from '../actions/RoomActions';
import * as ROOM from '../constants/RoomActions';
import * as RoomList from '../actions/RoomListActions';
import * as ROOM_LIST from '../constants/RoomListActions';
import * as Message from '../actions/MessageActions';
import * as MESSAGE from '../constants/MessageActions';
import * as MessageList from '../actions/MessageListActions';
import * as MESSAGE_LIST from '../constants/MessageListActions';
import { diceReplace } from './dice';
import { knex, exists, inserted } from './knex.js';

export const onAction = function(socket, io) {
    const dispatch = function(action, room_id) {
        let {
            server,
            ...otherProps,
        } = action;

        socket.emit('action', otherProps);
        if (room_id) socket.to(room_id).emit('action', otherProps);
    };

    let user_id = socket.user.id;
    let room_id;

    const listener =  function(action) {
        console.log('Action', action);

        let {
            type,
        } = action;

        switch (type) {
            case ROOM_LIST.FETCH:
                return Promise.all(
                        knex('rooms')
                            .whereNull('deleted')
                            .orderBy('created', 'desc')
                            .then(rooms => dispatch(RoomList.push(rooms))),
                        knex('room_histories')
                            .where('user_id', user_id)
                            .whereNull('deleted')
                            .orderBy('created', 'desc')
                            .then(rooms => dispatch(RoomList.pushHistory(rooms)))
                );
            case ROOM.CREATE:
                let id = '#' + crypto.createHash('sha256').update((new Date).getTime() + '').digest('hex').substr(0, 16);
                return knex('rooms')
                    .insert({
                        id: id,
                        title: action.title || null,
                        user_id: user_id,
                    })
                    .then(() => knex('rooms')
                        .where('id', id)
                        .whereNull('deleted')
                        .first()
                    )
                    .then(exists)
                    .then(room => {
                        dispatch(RoomList.push([room]));
                        dispatch(Room.created(room));
                    });
            case ROOM.JOIN:
                return knex('rooms')
                    .where('id', action.id)
                    .whereNull('deleted')
                    .first()
                    .then(exists)
                    .then(room => {
                        room_id = room.id;
                        socket.room = room;
                        socket.leave();
                        socket.join(room.id);
                        dispatch(Room.joined(room));
                    });
            case MESSAGE_LIST.FETCH:
                return (action.minId ? knex('messages').where('id', '<', action.minId) : knex('messages'))
                    .where('room_id', room_id)
                    .whereNull('deleted')
                    .orderBy('id', 'desc')
                    .limit(20)
                    .then(messages => {
                        dispatch(MessageList.push(messages));
                    });
            case MESSAGE.CREATE:
                return knex('messages')
                    .insert({
                        user_id,
                        room_id,
                        name: action.name || null,
                        character_url: action.character_url || null,
                        icon_id: action.icon_id || null,
                        message: diceReplace(action.message, io) || null,
                    })
                    .then(inserted)
                    .then(id => knex('messages').where('id', id).whereNull('deleted').first())
                    .then(message => dispatch(MessageList.push([message]), room_id));
        }
    };

    return listener;
};