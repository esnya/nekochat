import {roll} from '../../actions/DiceActions';
import {list, prependList, push} from '../../actions/MessageActions';
import * as MESSAGE from '../../constants/MessageActions';
import {Message} from '../models/message';
import {diceReplace} from '../dice';

export const message = (client) => (next) => (action) => {
    switch (action.type) {
        case MESSAGE.CREATE:
            diceReplace(`${action.message || ''}`)
                .then((diceMessage) =>
                    Message.insert({
                        user_id: client.user.id || null,
                        room_id: client.room.id || null,
                        icon_id: action.icon_id || null,
                        whisper_to: action.whisper_to || null,
                        name: action.name || null,
                        character_url: action.character_url || null,
                        message: diceMessage.message || null,
                    })
                    .then((message) => ({diceMessage, message}))
                )
                .then(({diceMessage, message}) => {
                    diceMessage.results.forEach((dice) => {
                        client.emit(roll(...dice));
                        client.publish(roll(...dice));
                    });

                    client.emit(push(message));
                    client.publish(push(message), message.whisper_to);
                });
            break;
        case MESSAGE.FETCH:
            Message
                .findLimit(client.room.id, client.user.id)
                .then((messages) => client.emit(list(messages)));
            break;
        case MESSAGE.REQUEST_PAST:
             Message
                .findLimit(
                    client.room.id,
                    client.user.id,
                    'id','<', action.lastId
                )
                .then((messages) => client.emit(prependList(messages)));
            break;
    }

    return next(action);
};
