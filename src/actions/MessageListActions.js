import * as MESSAGE_LIST from '../constants/MessageListActions';

export const fetch = function() {
    return {
        type: MESSAGE_LIST.FETCH,
        server: true,
    };
};

export const push = function(items) {
    return {
        type: MESSAGE_LIST.PUSH,
        items,
    };
};