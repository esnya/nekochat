import { debugLoggerMiddleWare } from './DebugLoggerMiddleware';
import { domMiddleware } from './DOMMiddleware';
import { confirmMiddleWare } from './ConfirmMiddleware';
import { characterMiddleWare } from './CharacterMiddleware';
import { notificationMiddleware } from './NotificationMiddleware';
import { room } from './RoomMiddleware';
import { routerMiddleware } from './RouterMiddleware';
import { socketMiddleware } from './SocketMiddleware';
import { systemNotificationMiddleware } from './SystemNotificationMiddleware';
import { timeoutMiddleware } from './TimeoutMiddleware';

export const middlewares = [
    domMiddleware,
    confirmMiddleWare,
    systemNotificationMiddleware,
    characterMiddleWare,
    notificationMiddleware,
    room,
    routerMiddleware,
    socketMiddleware,
    timeoutMiddleware,
    debugLoggerMiddleWare,
];
