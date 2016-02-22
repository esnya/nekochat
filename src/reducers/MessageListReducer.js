import * as MESSAGE from '../constants/MessageActions';
import * as ROOM from '../constants/RoomActions';
import { notice } from '../browser/sound';

export const messageListReducer = function(state = [], action) {
    switch (action.type) {
        case ROOM.LEAVE:
            return [];
        case MESSAGE.PUSH:
            notice();
            return [
                ...state,
                action.item,
            ];
        case MESSAGE.LIST:
            return [
                ...action.items.reverse(),
            ];
        case MESSAGE.PREPEND_LIST:
            return [
                ...action.items.reverse(),
                ...state,
            ];
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
