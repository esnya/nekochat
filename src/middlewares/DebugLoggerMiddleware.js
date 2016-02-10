/* eslint no-console: 0 */

import { Config } from '../browser/config';

window.redux_debug = Config.debug;

export const debugLoggerMiddleWare = ({getState}) => (next) => (action) => {
    if (window.redux_debug) console.log(action.type, action, getState());
    return next(action);
};