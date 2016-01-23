import { debugLoggerMiddleWare } from './DebugLoggerMiddleWare';
import { confirmMiddleWare } from './ConfirmMiddleWare';
import { characterMiddleWare } from './CharacterMiddleware';
import { snackMiddleware } from './SnackMiddleware';


export const middlewares = [
    confirmMiddleWare,
    snackMiddleware,
    characterMiddleWare,
    debugLoggerMiddleWare,
];