import * as MESSAGE from '../constants/MessageActions';
import * as ROOM from '../constants/RoomActions';
import { notice } from '../browser/sound';

let room = null;

const push = (state, items) => {
    if (items.length === 0) return state;

    if (!room || items[0].room_id !== room.id) return state;

    const filtered = state.filter((a) => !items.find((b) => a.id === b.id));

    if (filtered.length === 0) return [...items];

    if (items[items.length - 1].id > filtered[0].id) {
        return [
            ...items,
            ...filtered,
        ];
    } else if (items[0].id < filtered[filtered.length - 1].id) {
        return [
            ...filtered,
            ...items,
        ];
    }

    return state;
};

export const messageListReducer = function(state = [], action) {
    switch (action.type) {
        case ROOM.JOINED:
            room = action.room;
            return [];
        case ROOM.LEAVE:
            room = null;
            return [];
        case MESSAGE.PUSH:
            if (action.items.length > 0) notice();
            return push(state, action.items);
        case MESSAGE.UPDATE: {
            const items = Array.isArray(action.data)
                ? action.data
                : [action.data];

            return state.map((item) => ({
                        item,
                        update: items.find((b) => item.id === b.id),
                }))
                .map(
                    ({item, update}) => update
                        ? Object.assign({}, update)
                        : item
                );
        } default:
            return state;
    }
};