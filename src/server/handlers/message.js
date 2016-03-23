import {pick} from 'lodash';
import {roll} from '../../actions/DiceActions';
import {list, prependList, push} from '../../actions/MessageActions';
import * as MESSAGE from '../../constants/MessageActions';
import {generateId} from '../../utility/id';
import {File} from '../models/file';
import {Message} from '../models/message';
import {diceReplace} from '../dice';

export const message = (client) => (next) => (action) => {
    switch (action.type) {
        case MESSAGE.CREATE: {
            const file = action.files && action.files[0];
            const file_id = file ? generateId() : null;

            (file ? File.insert({
                id: file_id,
                user_id: client.user.id,
                name: file.name,
                type: file.mime,
                data: file.blob,
            }) : Promise.resolve())
                .then(() => diceReplace(`${action.message || ''}`))
                .then((diceMessage) =>
                    Message.insert({
                        user_id: client.user.id || null,
                        room_id: client.room.id || null,
                        icon_id: action.icon_id || null,
                        whisper_to: action.whisper_to || null,
                        name: action.name || null,
                        character_url: action.character_url || null,
                        message: diceMessage.message || null,
                        file_id,
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
                    client.touch();
                });
            break;
        }
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
