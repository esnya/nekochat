import { knex, exists, inserted } from '../knex.js';
import * as Message from '../../actions/MessageActions';
import * as MessageList from '../../actions/MessageListActions';
import * as MESSAGE from '../../constants/MessageActions';
import * as ROOM from '../../constants/RoomActions';
import { Dispatcher }  from './Dispatcher';
import { diceReplace } from '../dice';

export class MessageDispatcher extends Dispatcher {
    onDispatch(action) {
        switch(action.type) {
            case ROOM.JOINED:
                console.log(action);
                this.room_id = action.room.id;
                return;
            case MESSAGE.CREATE:
                return knex('messages')
                    .insert({
                        user_id: this.user_id,
                        room_id: this.room_id,
                        name: action.name || null,
                        character_url: action.character_url || null,
                        icon_id: action.icon_id || null,
                        message: diceReplace(action.message, this.socket.server) || null,
                    })
                    .then(inserted)
                    .then(id => knex('messages').where('id', id).whereNull('deleted').first())
                    .then(message => this.dispatch(MessageList.push([message]), this.room_id));
        }
    }
}