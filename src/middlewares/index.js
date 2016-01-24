import { debugLoggerMiddleWare } from './DebugLoggerMiddleware';
import { confirmMiddleWare } from './ConfirmMiddleware';
import { characterMiddleWare } from './CharacterMiddleware';
import { routerMiddleware } from './RouterMiddleware';
import { snackMiddleware } from './SnackMiddleware';
import { socketMiddleware } from './SocketMiddleware';
import { timeoutMiddleware } from './TimeoutMiddleware';

export const middlewares = [
    confirmMiddleWare,
    snackMiddleware,
    characterMiddleWare,
    routerMiddleware,
    socketMiddleware,
    timeoutMiddleware,
    debugLoggerMiddleWare,
];