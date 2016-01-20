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
    };
};

export const update = function(data) {
    return {
        type: ROOM.UPDATE,
        ...data,
    };
};

export const remove = function(id) {
    return {
        type: ROOM.REMOVE,
        server: true,
        id,
    }
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