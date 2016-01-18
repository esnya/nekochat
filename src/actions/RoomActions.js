import * as ROOM from '../constants/RoomActions';

export const create = function(data) {
    return {
        type: ROOM.CREATE,
        server: true,
        data,
    };
};

export const update = function(data) {
    return {
        type: ROOM.UPDATE,
        data,
    };
};

export const join = function(id) {
    return {
        type: ROOM.JOIN,
        server: true,
        id,
    };
};
export const joined = function(id) {
    return {
        type: ROOM.JOINED,
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