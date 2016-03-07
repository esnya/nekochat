import { combineReducers } from 'redux';
import { characters } from './CharacterReducer';
import { confirmList } from './ConfirmListReducer';
import { dialog } from './DialogReducer';
import { dom } from './DOMReducer';
import { iconListReducer } from './IconListReducer';
import { inputReducer } from './InputReducer';
import { messageFormReducer } from './MessageFormReducer';
import { messageListReducer } from './MessageListReducer';
import { notifications } from './NotificationReducer';
import { roomListReducer } from './RoomListReducer';
import { roomReducer } from './RoomReducer';
import { routeReducer } from './RouteReducer';
import { userReducer } from './UserReducer';

export const rootReducer = combineReducers({
    characters,
    confirmList,
    dialog,
    dom,
    iconList: iconListReducer,
    input: inputReducer,
    messageForm: messageFormReducer,
    messageList: messageListReducer,
    notifications,
    roomList: roomListReducer,
    room: roomReducer,
    route: routeReducer,
    user: userReducer,
});
