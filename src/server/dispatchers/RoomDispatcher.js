import * as Room from '../../actions/RoomActions';
import * as ROOM from '../../constants/RoomActions';
import { knex, exists, inserted } from '../knex.js';
import { Dispatcher } from './Dispatcher';
import { generateId } from '../id';

export class RoomDispatcher extends Dispatcher {
    onDispatch(action) {
        switch (action.type) {
            case ROOM.CREATE:
                let id = '#' + generateId((new Date).getTime() + '').substr(0, 16);
                return knex('rooms')
                    .insert({
                        id: id,
                        title: action.title || null,
                        user_id: this.user_id,
                    })
                    .then(() => knex('rooms')
                        .where('id', id)
                        .whereNull('deleted')
                        .first()
                    )
                    .then(exists)
                    .then(room => {
                        this.dispatch(Room.push([room]));
                        this.dispatch(Room.created(room));
                    });
            case ROOM.JOIN:
                return knex('rooms')
                    .where('id', action.id)
                    .whereNull('deleted')
                    .first()
                    .then(exists)
                    .then(room => {
                        this.socket.leave();
                        this.socket.join(room.id);
                        this.dispatch(Room.joined(room));
                    });
            case ROOM.FETCH:
                return Promise.all(
                        knex('rooms')
                            .whereNull('deleted')
                            .orderBy('created', 'desc')
                            .then(rooms => this.dispatch(Room.push(rooms))),
                        knex('room_histories')
                            .where('user_id', this.user_id)
                            .whereNull('deleted')
                            .orderBy('created', 'desc')
                            .then(rooms => this.dispatch(Room.pushHistory(rooms)))
                );
        }
    }
}