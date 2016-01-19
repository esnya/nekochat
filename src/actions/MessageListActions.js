import * as MESSAGE_LIST from '../constants/MessageListActions';

export const fetch = function(minId = null) {
    return {
        type: MESSAGE_LIST.FETCH,
        server: true,
        minId,
    };
};

export const push = function(items) {
    return {
        type: MESSAGE_LIST.PUSH,
        items,
    };
};