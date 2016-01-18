import * as MESSAGE_LIST from '../constants/MessageListActions';

export const messageList = function(state = [], action) {
    let {
        type,
        ...props,
    } = action;
    
    switch (type) {
        case MESSAGE_LIST.PUSH:
            return [...props.items, ...state];
        default:
            return state;
    }
};