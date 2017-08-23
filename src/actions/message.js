import axios from 'axios';
import { createAction } from 'redux-actions';

const sync = () => ({ sync: true });

export const CREATE = 'MESSAGE_CREATE';
export const create = createAction(CREATE,
    message => (
        message.file ? axios({
            method: 'POST',
            url: '/api/files',
            data: message.file,
            withCredentials: true,
        }).then(({ data }) => ({
            ...message,
            file_id: data.id,
            file_type: data.type,
        })) : message
    ),
    ({ id, name, user_id, message }) => ({
        sync: true,
        sound: 'notice',
        notify: (id && Array.isArray(message)) ? {
            // eslint-disable-next-line camelcase
            title: `${name}@${user_id}`,
            body:
                message.map(
                    nodes => nodes.map(({ text }) => text).join(''),
                ).join(''),
        } : null,
    }),
);

export const UPDATE = 'MESSAGE_UPDATE';
export const update = createAction(UPDATE, msg => msg, sync);

export const FETCH = 'MESSAGE_FETCH';
export const fetch = createAction(FETCH, (minId = null) => minId, sync);

export const LIST = 'MESSAGE_LIST';
export const list = createAction(LIST, msgs => msgs);

export const OLD = 'MESSAGE_OLD';
export const old = createAction(OLD, msgs => msgs);
