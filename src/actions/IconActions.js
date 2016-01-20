import * as ICON from '../constants/IconActions';

export const create = function(data) {
    return {
        type: ICON.CREATE,
        server: true,
        ...data,
    };
};

export const remove = function(id) {
    return {
        type: ICON.REMOVE,
        id,
    };
};

export const fetch = function() {
    return {
        type: ICON.FETCH,
        server: true,
    };
};

export const push = function(icons) {
    return {
        type: ICON.PUSH,
        icons,
    };
};