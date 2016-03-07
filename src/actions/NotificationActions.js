import * as NOTIFICATION from '../constants/NotificationActions';

let lastId = 0;

export const notify = function(notification, data = null) {
    return {
        type: NOTIFICATION.NOTIFY,
        notification: {
            ...notification,
            id: lastId++,
            data: {
                ...data,
            },
        },
    };
};

export const close = function(id) {
    return {
        type: NOTIFICATION.CLOSE,
        id,
    };
};
