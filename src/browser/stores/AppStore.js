import { createStore, combineReducers } from 'redux';
import { messageListReducer } from '../reducers/MessageListReducer';
import { roomListReducer } from '../reducers/RoomListReducer';
import { roomReducer } from '../reducers/RoomReducer';
import { socketReducer } from '../reducers/SocketReducer';

export const AppStore = createStore(combineReducers({
    messageList: messageListReducer,
    roomList: roomListReducer,
    room: roomReducer,
    socket: socketReducer,
}));