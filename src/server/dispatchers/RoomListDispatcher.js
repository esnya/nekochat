import * as RoomList from '../../actions/RoomListActions';
import * as ROOM_LIST from '../../constants/RoomListActions';
import { knex, exists, inserted } from '../knex.js';
import { Dispatcher } from './Dispatcher';

export class RoomListDispatcher extends Dispatcher {
    onDispatch(action) {
        switch (action.type) {
            case ROOM_LIST.FETCH:
                return Promise.all(
                        knex('rooms')
                            .whereNull('deleted')
                            .orderBy('created', 'desc')
                            .then(rooms => this.dispatch(RoomList.push(rooms))),
                        knex('room_histories')
                            .where('user_id', this.user_id)
                            .whereNull('deleted')
                            .orderBy('created', 'desc')
                            .then(rooms => this.dispatch(RoomList.pushHistory(rooms)))
                );
        }
    }
}