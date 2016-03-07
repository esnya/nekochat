import * as ICON from '../constants/IconActions';

export const create = function(data) {
    return {
        type: ICON.CREATE,
        server: true,
        ...data,
    };
};

export const remove = function(icon) {
    return {
        ...icon,
        type: ICON.REMOVE,
        confirm: {
            title: 'Delete Icon',
            message: 'Delete icon "${name}"',
        },
        server: true,
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

