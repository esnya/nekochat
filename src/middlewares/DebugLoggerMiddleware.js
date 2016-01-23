/* eslint no-unused-vars: 0 */
/* eslint arrow-body-style: 0 */

export const debugLoggerMiddleWare = ({getState}) => (next) => (action) => {
    // console.log(action.type, action, getState());
    return next(action);
};