import * as MESSAGE from '../../constants/MessageActions';
import * as ROOM from '../../constants/RoomActions';

const notice = () => {
    document.getElementById('notice-sound').play();
};

const push = (state, items) => {
    if (items.length == 0) return state;

    let filtered = state.filter(a => !items.find(b => a.id == b.id));
    if (filtered.length == 0) return [...items];

    if (items[items.length - 1].id > filtered[0].id) return [
        ...items,
        ...filtered,
    ];
    else if (items[0].id < filtered[filtered.length - 1].id) return [
        ...filtered,
        ...items,
    ];

    return state;
};

export const messageListReducer = function(state = [], action) {
    switch (action.type) {
        case ROOM.JOINED:
        case ROOM.LEAVE:
            return [];
        case MESSAGE.PUSH:
            if (action.items.length > 0) notice();
            return push(state, action.items);
        default:
            return state;
    }
};