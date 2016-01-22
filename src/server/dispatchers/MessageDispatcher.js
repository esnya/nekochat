import { knex, exists, inserted } from '../knex.js';
import * as Message from '../../actions/MessageActions';
import * as MESSAGE from '../../constants/MessageActions';
import * as ROOM from '../../constants/RoomActions';
import { Dispatcher }  from './Dispatcher';
import { diceReplace } from '../dice';

export class MessageDispatcher extends Dispatcher {
    onDispatch(action) {
        switch(action.type) {
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
                    .then(message => this.dispatch(Message.push([message]), this.room_id));
            case ROOM.JOINED:
                this.room_id = action.room.id;
            case MESSAGE.FETCH:
                return (action.minId ? knex('messages').where('id', '<', action.minId) : knex('messages'))
                    .where('room_id', this.room_id)
                    .whereNull('deleted')
                    .orderBy('id', 'desc')
                    .limit(20)
                    .then(messages => {
                        this.dispatch(Message.push(messages));
                    });
        }
    }
}