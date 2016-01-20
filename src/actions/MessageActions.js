import * as MESSAGE from '../constants/MessageActions';

export const create = function(data) {
    return {
        type: MESSAGE.CREATE,
        server: true,
        ...data,
    };
};

export const update = function(data) {
    return {
        type: MESSAGE.UPDATE,
        data,
    };
};

export const fetch = function(minId = null) {
    return {
        type: MESSAGE.FETCH,
        server: true,
        minId,
    };
};

export const push = function(items) {
    return {
        type: MESSAGE.PUSH,
        items,
    };
};