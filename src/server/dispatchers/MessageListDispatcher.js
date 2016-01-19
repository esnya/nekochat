import { knex, exists, inserted } from '../knex.js';
import * as MessageList from '../../actions/MessageListActions';
import * as MESSAGE_LIST from '../../constants/MessageListActions';
import * as ROOM from '../../constants/RoomActions';
import { Dispatcher }  from './Dispatcher';

export class MessageListDispatcher extends Dispatcher {
    onDispatch(action) {
        switch(action.type) {
            case ROOM.JOINED:
                this.room_id = action.room.id;
                return;
            case MESSAGE_LIST.FETCH:
                return (action.minId ? knex('messages').where('id', '<', action.minId) : knex('messages'))
                    .where('room_id', this.room_id)
                    .whereNull('deleted')
                    .orderBy('id', 'desc')
                    .limit(20)
                    .then(messages => {
                        this.dispatch(MessageList.push(messages));
                    });
        }
    }
}