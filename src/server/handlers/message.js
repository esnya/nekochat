import {roll} from '../../actions/DiceActions';
import {list, prependList, push} from '../../actions/MessageActions';
import * as MESSAGE from '../../constants/MessageActions';
import {generateId} from '../../utility/id';
import {File} from '../models/file';
import {Message} from '../models/message';
import {diceReplace} from '../dice';

const processFile = (client, action) => {
    const file = action.files && action.files[0];
    const file_id = file ? generateId() : null;

    if (!file) return Promise.resolve();

    return File.insert({
            id: file_id,
            user_id: client.user.id,
            name: file.name,
            type: file.mime,
            data: file.blob,
        })
        .then(() => file_id);
};

export const message = (client) => (next) => (action) => {
    switch (action.type) {
        case MESSAGE.CREATE: {
            processFile(client, action)
                .then((file_id) => diceReplace(`${action.message || ''}`)
                    .then((diceMessage) => ({
                        diceMessage,
                        file_id,
                    }))
                )
                .then(({diceMessage, file_id}) =>
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
                })
                .catch((e) => client.logger.error(e));
            break;
        }
        case MESSAGE.FETCH:
            Message
                .findLimit(client.room.id, client.user.id)
                .then((messages) => client.emit(list(messages)))
                .catch((e) => client.logger.error(e));
            break;
        case MESSAGE.REQUEST_PAST:
             Message
                .findLimit(
                    client.room.id,
                    client.user.id,
                    'id','<', action.lastId
                )
                .then((messages) => client.emit(prependList(messages)))
                .catch((e) => client.logger.error(e));
            break;
    }

    return next(action);
};
