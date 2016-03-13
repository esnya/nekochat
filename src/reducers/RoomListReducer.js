import { pick } from 'lodash';
import * as ROOM from '../constants/RoomActions';

export const roomListReducer = function(state = [], action) {
    switch (action.type) {
        case ROOM.CREATED:
            if (!action.room) return state;

            return [
                action.room,
                ...state,
            ];
        case ROOM.UPDATED:
            return state.map(
                (room) => room.id === action.id
                    ? {
                        ...room,
                        ...pick(action, 'title'),
                    } : room
            );
        case ROOM.LIST:
            if (!Array.isArray(action.list)) return state;

            return action.list.map((i) => ({...i}));
        case ROOM.REMOVE:
            return state.filter((room) => room.id !== action.id);
        default:
            return state;
    }
};
