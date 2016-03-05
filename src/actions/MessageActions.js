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

/* eslint max-len: "warn" */
export const push = function(item) {
    return {
        type: MESSAGE.PUSH,
        systemNotify: {
            title: '${item.name}',
            body:
                '${item.message[0] && item.message[0][0] && item.message[0][0].text || ""}',
            icon:
                '${item.icon_id ? ("/icon/" + item.icon_id) : icon}',
            tag: '${item.room_id}',
            character_url: item.character_url,
        },
        item,
    };
};

export const list = (items) => ({
    type: MESSAGE.LIST,
    items,
});

export const requestPast = (lastId) => ({
    type: MESSAGE.REQUEST_PAST,
    server: true,
    lastId: parseInt(lastId, 10),
});

export const prependList = (items) => ({
    type: MESSAGE.PREPEND_LIST,
    items,
});
