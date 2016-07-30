/* eslint camelcase: "off" */

import { mapValues, pick } from 'lodash';
import { roll } from '../../actions/dice';
import {
    create,
    list,
    old,
    CREATE,
    FETCH,
} from '../../actions/message';
import { Message } from '../models/message';
import { parseDice } from '../dice';

export const createMessage = (client, message) =>
    Message
        .insert(mapValues({
            ...pick(message, [
                'icon_id',
                'whisper_to',
                'name',
                'character_url',
                'file_id',
                'file_type',
                'message',
            ]),
            user_id: client.user.id,
            room_id: client.room.id,
        }, v => (v || null)))
        .then((data) => {
            client.emit(create(data));
            client.publish(create(data), data.whisper_to);
            client.touch();

            return data;
        });

export default (client) => (next) => (action) => {
    const {
        type,
        payload,
    } = action;

    switch (type) {
    case CREATE: {
        const {
            nodes,
            results,
        } = parseDice(payload.message || '');

        createMessage(client, {
            ...payload,
            message: JSON.stringify(nodes),
        }).then((message) => {
            results.forEach((dice) => {
                client.emit(roll(dice));
                client.publish(roll(dice), message.whisper_to);
            });
        }, e => client.logger.error(e));
        break;
    } case FETCH:
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
                        'id', '<', action.payload
                    )
                .then((messages) => client.emit(old(messages.reverse())))
                .catch((e) => client.logger.error(e));
        }
        break;

    default: break;
    }

    return next(action);
};
