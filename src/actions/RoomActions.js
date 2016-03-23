import * as ROOM from '../constants/RoomActions';
import { set as setRoute } from './RouteActions';

export const join = function(id, password = null) {
    return {
        type: ROOM.JOIN,
        server: true,
        id,
        password,
    };
};
export const joined = function(room) {
    return {
        type: ROOM.JOINED,
        room,
    };
};
export const password = function(id) {
    return {
        type: ROOM.PASSWORD,
        id,
    };
};

export const leave = function() {
    return {
        type: ROOM.LEAVE,
        server: true,
    };
};
export const left = function() {
    return {
        type: ROOM.LEFT,
    };
};

export const create = function(data) {
    return {
        type: ROOM.CREATE,
        server: true,
        ...data,
    };
};
export const created = function(room) {
    return {
        type: ROOM.CREATED,
        room,
        notify: {
            action: 'Join',
            next: setRoute(`/${room.id}`),
            icon: 'done',
            message: 'Room "${room.title}" created',
        },
    };
};

export const update = function(data) {
    return {
        ...data,
        type: ROOM.UPDATE,
        server: true,
    };
};
export const updated = function(data) {
    return {
        ...data,
        type: ROOM.UPDATED,
    };
};

export const remove = function(room) {
    return {
        ...room,
        type: ROOM.REMOVE,
        server: true,
        confirm: {
            title: 'Delete Room',
            message: 'Delete room "${title}"',
        },
        snack: {
            data: room,
            icon: 'done',
            message: 'Room "${title}" deleted',
        },
    };
};

/**
 * Push room list
 * @param{Array} list - array of rooms
 * @returns{Object} action
 */
export function list(list) {
    return {
        type: ROOM.LIST,
        list,
    };
}

export const fetch = function() {
    return {
        type: ROOM.FETCH,
        server: true,
    };
};

export const userJoined = (user) => ({
    type: ROOM.USER_JOINED,
    user,
    notify: {
        icon: 'person',
        message: '"${user.name}" joined',
    },
});
export const userLeft = (user) => ({
    type: ROOM.USER_LEFT,
    user,
    notify: {
        icon: 'person_outline',
        message: '"${user.name}" left',
    },
});
export const fetchUser = () => ({
    type: ROOM.FETCH_USER,
    server: true,
});
export const userList = (users) => ({
    type: ROOM.USER_LIST,
    users,
});

export const notesUpdate = (notes) => ({
    type: ROOM.NOTES_UPDATE,
    server: true,
    notes,
});
export const notesUpdated = (notes) => ({
    type: ROOM.NOTES_UPDATED,
    notes,
});

