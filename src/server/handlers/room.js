import _ from 'lodash';
import {
    fetch as ifetch,
} from '../../actions/icon';
import {
    fetch as mfetch,
} from '../../actions/message';
import {
    create,
    fetch,
    update,
    join,
    list,
    password,
    CREATE,
    JOIN,
    LEAVE,
    FETCH,
    REMOVE,
    UPDATE,
} from '../../actions/room';
import { UPDATE as MUPDATE } from '../../actions/memo';
import {
    joined,
    left,
    fetch as ufetch,
    list as ulist,
    FETCH as UFETCH,
} from '../../actions/user';
import * as NodeType from '../../constants/NodeType';
import { PASSWORD_INCORRECT, Room } from '../models/room';
import { Message } from '../models/message';
import { generateId } from '../../utility/id';
import cacheStore from '../cacheStore';
import { createMessage } from './message';

const ID_LENGTH = 16;

export default (client) => (next) => (action) => {
    const {
        payload,
        type,
   } = action;

    switch (type) {
    case CREATE:
        Room
            .insert({
                id: generateId(`${(new Date()).getTime()}`)
                    .substr(0, ID_LENGTH),
                dice: payload.dice || null,
                title: payload.title || null,
                password: payload.password || null,
                state: payload.state || 'open',
                user_id: client.user.id || null,
            })
            .then((room) => client.emit(create(room)))
            .catch((e) => client.logger.error(e));
        break;
    case JOIN:
        Room
            .join(payload.id, payload.password || null)
            .then((room) => Message.getRoomInfo(room.id).then((info) => ({
                ...room,
                ...info,
            })))
            .then((room) => {
                client.join(room);
                client.emit(join(room));
                client.publish(joined(client.user));
                client.dispatch(ifetch());
                client.dispatch(mfetch());
                client.dispatch(ufetch());
            })
            .catch((e) => {
                if (e === PASSWORD_INCORRECT) {
                    return Room.find('id', payload.id)
                        .then((room) => client.emit(password(room)));
                }

                return Promise.reject(e);
            })
            .catch((e) => client.logger.error(e));
        break;
    case LEAVE:
        client.dispatch(fetch());
        client.publish(left(client.user));
        client.leave();
        break;
    case FETCH:
        Room
            .findAll()
            .then((rooms) => client.emit(list(rooms)))
            .catch((e) => client.logger.error(e));
        break;
    case REMOVE:
        Room
            .del({
                id: payload.id || null,
                user_id: client.user.id || null,
            })
            .then(() => {})
            .catch((e) => client.logger.error(e));
        break;
    case UPDATE:
        Room
            .update(
                    client.room.id,
                    client.user.id,
                    _(payload)
                        .pick(['title', 'dice', 'password', 'state'])
                        .mapValues((a) => (a === '' ? null : a))
                        .value()
                )
            .then((room) => {
                // eslint-disable-next-line no-param-reassign
                client.room = room;
                client.emit(update(room));
                client.publish(update(room));
            })
            .catch((e) => client.logger.error(e));
        break;
    case UFETCH:
        if (!client.room) break;

        cacheStore.hgetall(`${client.room_key}:users`, (err, obj) => {
            if (err) {
                client.logger.error(err);

                return;
            }

            client.emit(ulist(
                    _(obj)
                        .values()
                        .map((json) => JSON.parse(json))
                        .orderBy(['login', 'timestamp'], ['desc', 'desc'])
                        .value()
                ));
        });
        break;

    case MUPDATE:
        if (!client.room) break;

        Room
            .update(
                client.room.id,
                client.user.id,
                { memo: payload || null },
                true
            )
            .then((room) => {
                client.emit(update(room));
                client.publish(update(room));

                return createMessage(client, {
                    name: 'MEMO',
                    message: JSON.stringify(room.memo
                        .split(/\r\n|\n/)
                        .map((line) => [{
                            type: NodeType.MEMO,
                            text: line,
                        }])),
                });
            })
            .catch((e) => client.logger.error(e));
        break;

    default: break;
    }

    return next(action);
};
