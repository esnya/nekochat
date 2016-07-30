/* eslint camelcase: "off" */

import _ from 'lodash';
import { roll } from '../../actions/dice';
import {
    create,
    list,
    old,
    CREATE,
    FETCH,
} from '../../actions/message';
import { Message } from '../models/message';
import { diceReplace } from '../dice';

export default (client) => (next) => (action) => {
    const {
        type,
        payload,
    } = action;

    switch (type) {
    case CREATE:
        diceReplace(action.payload.message || '')
                .then((diceMessage) =>
                    Message.insert({
                        user_id: client.user.id || null,
                        room_id: client.room.id || null,
                        icon_id: action.payload.icon_id || null,
                        ...(
                            _(payload)
                            .pick([
                                'whisper_to',
                                'name',
                                'character_url',
                                'file_id',
                                'file_type',
                            ])
                            .mapValues(value => (value || null))
                            .value()
                        ),
                        message: JSON.stringify(diceMessage.nodes),
                    })
                    .then((message) => ({ diceMessage, message }))
                )
                .then(({ diceMessage, message }) => {
                    diceMessage.results.forEach((dice) => {
                        client.emit(roll(dice));
                        client.publish(roll(dice), message.whisper_to);
                    });

                    client.emit(create(message));
                    client.publish(create(message), message.whisper_to);
                    client.touch();
                })
                .catch((e) => client.logger.error(e));
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
