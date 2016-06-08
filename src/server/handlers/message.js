import { roll } from '../../actions/dice';
import {
    create,
    list,
    old,
    CREATE,
    FETCH,
    IMAGE,
} from '../../actions/message';
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
    const {
        type,
        payload,
    } = action;

    switch (type) {
        case CREATE: {
            processFile(client, action)
                .then(
                    (file_id) => diceReplace(`${action.payload.message || ''}`)
                        .then((diceMessage) => ({
                            diceMessage,
                            file_id,
                        }))
                )
                .then(({ diceMessage, file_id }) =>
                    Message.insert({
                        user_id: client.user.id || null,
                        room_id: client.room.id || null,
                        icon_id: action.payload.icon_id || null,
                        whisper_to: action.payload.whisper_to || null,
                        name: action.payload.name || null,
                        character_url: action.payload.character_url || null,
                        message: diceMessage.message || null,
                        file_id,
                    })
                    .then((message) => ({ diceMessage, message }))
                )
                .then(({diceMessage, message}) => {
                    diceMessage.results.forEach((dice) => {
                        client.emit(roll(...dice));
                        client.publish(roll(...dice), message.whisper_to);
                    });

                    client.emit(create(message));
                    client.publish(create(message), message.whisper_to);
                    client.touch();
                })
                .catch((e) => client.logger.error(e));
            break;
        }
        case IMAGE:
            File
                .insert({
                    id: generateId(),
                    user_id: client.user.id || null,
                    name: payload.file.name || null,
                    type: payload.file.type || null,
                    data: payload.file.file || null,
                })
                .then((file) => Message.insert({
                    user_id: client.user.id || null,
                    room_id: client.room.id || null,
                    icon_id: payload.icon_id || null,
                    name: payload.name || null,
                    character_url: payload.character_url || null,
                    message: JSON.stringify([]),
                    file_id: file.id,
                }))
                .then((message) => {
                    client.emit(create(message));
                    client.publish(create(message));
                    client.touch();
                });
            break;
        case FETCH:
            if (!action.payload) {
                Message
                    .findLimit(client.room.id, client.user.id)
                    .then((messages) => client.emit(list(messages.reverse())))
                    .catch((e) => client.logger.error(e));
            } else {
                Message
                    .findLimit(
                        client.room.id,
                        client.user.id,
                        'id','<', action.payload
                    )
                    .then((messages) => client.emit(old(messages.reverse())))
                    .catch((e) => client.logger.error(e));
            }
            break;
    }

    return next(action);
};
