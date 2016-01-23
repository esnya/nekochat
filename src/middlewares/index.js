import { debugLoggerMiddleWare } from './DebugLoggerMiddleware';
import { confirmMiddleWare } from './ConfirmMiddleware';
import { characterMiddleWare } from './CharacterMiddleware';
import { snackMiddleware } from './SnackMiddleware';
import { socketMiddleware } from './socketMiddleware';


export const middlewares = [
    confirmMiddleWare,
    snackMiddleware,
    characterMiddleWare,
    socketMiddleware,
    debugLoggerMiddleWare,
];