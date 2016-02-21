import { combineReducers } from 'redux';
import { characterReducer as characters } from './CharacterReducer';
import { confirmListReducer } from './ConfirmListReducer';
import { dialogReducer } from './DialogReducer';
import { domReducer } from './DOMReducer';
import { iconListReducer } from './IconListReducer';
import { inputReducer } from './InputReducer';
import { messageFormReducer } from './MessageFormReducer';
import { messageListReducer } from './MessageListReducer';
import { notificationReducer as notifications } from './NotificationReducer';
import { roomListReducer } from './RoomListReducer';
import { roomReducer } from './RoomReducer';
import { routeReducer } from './RouteReducer';
import { userReducer } from './UserReducer';

export const rootReducer = combineReducers({
    characters,
    confirmList: confirmListReducer,
    dialog: dialogReducer,
    dom: domReducer,
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