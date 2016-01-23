import { debugLoggerMiddleWare } from './DebugLoggerMiddleware';
import { confirmMiddleWare } from './ConfirmMiddleware';
import { characterMiddleWare } from './CharacterMiddleware';
import { snackMiddleware } from './SnackMiddleware';


export const middlewares = [
    confirmMiddleWare,
    snackMiddleware,
    characterMiddleWare,
    debugLoggerMiddleWare,
];