import * as ROOM from '../constants/RoomActions';

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
        snack: {
            data: room,
            icon: 'done',
            message: 'Room "${title}" created',
        },
    };
};

export const update = function(data) {
    return {
        type: ROOM.UPDATE,
        ...data,
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

export const join = function(id) {
    return {
        type: ROOM.JOIN,
        server: true,
        id,
    };
};
export const joined = function(room) {
    return {
        type: ROOM.JOINED,
        room,
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


export const fetch = function() {
    return {
        type: ROOM.FETCH,
        server: true,
    };
};

export const push = function(items) {
    return {
        type: ROOM.PUSH,
        rooms: items,
    };
};

export const pushHistory = function(items) {
    return {
        type: ROOM.PUSH_HISTORY,
        history: items,
    };
};