import crypto from 'crypto';
import * as ROOM_LIST from '../constants/RoomListActions';
import * as ROOM from '../constants/RoomActions';
import * as Room from '../actions/RoomActions';
import * as RoomList from '../actions/RoomListActions';
import { knex, exists } from './knex.js';

export const onAction = function(socket) {
    const dispatch = function(action) {
        socket.emit('action', action);
    };
    
    let user_id = socket.user.id;

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
                        listener(Room.join(id));
                    });
            case ROOM.JOIN:
                return knex('rooms')
                    .where('id', action.id)
                    .whereNull('deleted')
                    .first()
                    .then(exists)
                    .then(room => {
                        socket.join(room.id);
                        dispatch(Room.joined(room));
                    });
        }
    };

    return listener;
};