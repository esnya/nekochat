import { createStore, combineReducers } from 'redux';
import { iconListReducer } from '../reducers/IconListReducer';
import { inputReducer } from '../reducers/InputReducer';
import { messageFormReducer } from '../reducers/MessageFormReducer';
import { messageListReducer } from '../reducers/MessageListReducer';
import { roomListReducer } from '../reducers/RoomListReducer';
import { roomReducer } from '../reducers/RoomReducer';
import { socketReducer } from '../reducers/SocketReducer';

export const AppStore = createStore(combineReducers({
    iconList: iconListReducer,
    input: inputReducer,
    messageForm: messageFormReducer,
    messageList: messageListReducer,
    roomList: roomListReducer,
    room: roomReducer,
    socket: socketReducer,
}));