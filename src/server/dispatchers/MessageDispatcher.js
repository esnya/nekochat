import { knex, inserted } from '../knex.js';
import * as Message from '../../actions/MessageActions';
import * as MESSAGE from '../../constants/MessageActions';
import * as ROOM from '../../constants/RoomActions';
import { Dispatcher }  from './Dispatcher';
import { diceReplace } from '../dice';

const MESSAGE_LIMIT = 20;

export class MessageDispatcher extends Dispatcher {
    onDispatch(action) {
        const user_id = this.user_id;

        switch (action.type) {
            case MESSAGE.CREATE:
                return diceReplace(`${action.message || ''}`)
                    .then((diceMessage) =>
                        knex('messages')
                            .insert({
                                user_id: this.user_id,
                                room_id: this.room_id,
                                icon_id: action.icon_id || null,
                                whisper_to: action.whisper_to || null,
                                name: action.name || null,
                                character_url: action.character_url || null,
                                message: diceMessage.message || null,
                                created: knex.fn.now(),
                                modified: knex.fn.now(),
                            })
                            .then(inserted)
                            .then((id) => knex('messages')
                                .where('id', id)
                                .whereNull('deleted')
                                .first()
                            )
                            .then((message) => {
                                diceMessage.results.forEach((dice) => {
                                    this
                                        .socket
                                        .server
                                        .to(this.room_id)
                                        .emit('dice', ...dice);
                                });
                                this.dispatch(
                                    Message.push(message),
                                    message.whisper_to
                                        ? [
                                            `${this.room_id}/${this.user_id}`,
                                            `${this.room_id}/${message.whisper_to}`,
                                        ] : this.room_id
                                );
                            })
                    );
            case ROOM.JOINED:
                this.room_id = action.room.id;
                return this.onDispatch({type: MESSAGE.FETCH});
            case MESSAGE.FETCH:
                return knex('messages')
                    .where('room_id', this.room_id)
                    .whereNull('deleted')
                    .where(function() {
                        this
                            .whereNull('whisper_to')
                            .orWhere('whisper_to', user_id)
                            .orWhere('user_id', user_id);
                    })
                    .orderBy('id', 'desc')
                    .limit(MESSAGE_LIMIT)
                    .then((messages) => {
                        this.dispatch(Message.list(messages));
                    });
            case MESSAGE.REQUEST_PAST:
                return knex('messages')
                    .where('id', '<', action.lastId)
                    .where('room_id', this.room_id)
                    .whereNull('deleted')
                    .where(function() {
                        this
                            .whereNull('whisper_to')
                            .orWhere('whisper_to', user_id)
                            .orWhere('user_id', user_id);
                    })
                    .orderBy('id', 'desc')
                    .limit(MESSAGE_LIMIT)
                    .then((messages) => {
                        this.dispatch(Message.prependList(messages));
                    });
        }
    }
}
