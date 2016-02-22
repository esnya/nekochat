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
        systemNotify: {
            title: '${items[0] && items[0].name}',
            body: '${items[0] && items[0].message}',
            icon: '/icon/${items[0] && items[0].icon_id}',
            tag: '${items[0] && items[0].room_id}',
        },
        items,
    };
};