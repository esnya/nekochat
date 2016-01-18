import { createStore, combineReducers } from 'redux';
import { messageList } from '../reducres/MessageListReducer';
import { roomList } from '../reducres/RoomListReducer';

export const AppStore = createStore(combineReducers({
    messageList,
    roomList,
}));