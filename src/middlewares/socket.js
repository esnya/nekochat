import socket from '../browser/socket';
import { set as setRoute, CONNECT } from '../actions/route';

export default ({ dispatch }) => (next) => (action) => {
    if (action.meta && action.meta.sync) socket.emit('action', action);

    if (action.type === CONNECT) {
        dispatch(setRoute(location.pathname));
    }

    return next(action);
};
