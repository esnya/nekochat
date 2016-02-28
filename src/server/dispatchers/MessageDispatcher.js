import { list, prependList, push } from '../../actions/MessageActions';
import * as MESSAGE from '../../constants/MessageActions';
import * as ROOM from '../../constants/RoomActions';
import { Dispatcher }  from './Dispatcher';
import { Message } from '../models/message';
import { diceReplace } from '../dice';

export class MessageDispatcher extends Dispatcher {
    onDispatch(action) {
        const user_id = this.user_id;

        switch (action.type) {
            case MESSAGE.CREATE:
                return diceReplace(`${action.message || ''}`)
                    .then((diceMessage) =>
                        Message.insert({
                            user_id: this.user_id,
                            room_id: this.room_id,
                            icon_id: action.icon_id || null,
                            whisper_to: action.whisper_to || null,
                            name: action.name || null,
                            character_url: action.character_url || null,
                            message: diceMessage.message || null,
                        })
                        .then((message) => {
                            diceMessage.results.forEach((dice) => {
                                this
                                    .socket
                                    .server
                                    .to(this.room_id)
                                    .emit('dice', ...dice);
                            });
                            this.dispatch(
                                push(message),
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
                return Message
                    .findLimit(this.room_id, user_id)
                    .then((messages) => {
                        this.dispatch(list(messages));
                    });
            case MESSAGE.REQUEST_PAST:
                return Message
                    .findLimit(this.room_id, user_id, 'id', '<', action.lastId)
                    .then((messages) => {
                        this.dispatch(prependList(messages));
                    });
        }
    }
}
