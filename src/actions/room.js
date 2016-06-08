import { createAction } from 'redux-actions';

export const sync = () => ({ sync: true });

export const CREATE = 'ROOM_CREATE';
export const create = createAction(CREATE, (room) => room, sync);

export const UPDATE = 'ROOM_UPDATE';
export const update = createAction(UPDATE, (room) => room, sync);

export const REMOVE = 'ROOM_REMOVE';
export const remove = createAction(REMOVE, ({ id }) => ({ id }), (room) => ({
    dialog: {
        type: 'confirm',
        title: 'Delete Room',
        message: `Are you sure to delete "${room.title}"?`,
    },
    sync: true,
}));

export const FETCH = 'ROOM_FETCH';
export const fetch = createAction(FETCH, () => {}, sync);

export const LIST = 'ROOM_LIST';
export const list = createAction(LIST, (rooms) => rooms, sync);

export const JOIN = 'ROOM_JOIN';
export const join =  createAction(JOIN, (room) => room, sync);

export const PASSWORD = 'ROOM_PASSWORD';
export const password =
    createAction(PASSWORD, (room) => room, (room) => ({
        dialog: {
            type: 'room-password',
            room,
        },
    }));

export const LEAVE = 'ROOM_LEAVE';
export const leave = createAction(LEAVE, () => {}, sync);
