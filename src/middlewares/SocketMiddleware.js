import { socket } from '../browser/socket';
import { set as setRoute } from '../actions/RouteActions';
import * as SOCKET from '../constants/SocketActions';

export const socketMiddleware = ({dispatch}) => (next) => (action) => {
    const {
        server,
        ...toEmit,
    } = action;

    if (server) socket.emit('action', toEmit);

    if (action.type === SOCKET.CONNECT) {
        dispatch(setRoute(location.pathname));
    }

    return next(action);
};
