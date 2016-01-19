import * as Room from '../../actions/RoomActions';
import * as RoomList from '../../actions/RoomListActions';
import * as ROOM from '../../constants/RoomActions';
import { knex, exists, inserted } from '../knex.js';
import { Dispatcher } from './Dispatcher';

export class RoomDispatcher extends Dispatcher {
    onDispatch(action) {
        switch (action.type) {
            case ROOM.CREATE:
                let id = '#' + crypto.createHash('sha256').update((new Date).getTime() + '').digest('hex').substr(0, 16);
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
                        this.dispatch(RoomList.push([room]));
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
        }
    }
}