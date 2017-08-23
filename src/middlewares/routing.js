import { ROUTER_DID_CHANGE } from 'redux-router/lib/constants';
import * as Room from '../actions/room';
import * as Socket from '../actions/socket';
import * as UI from '../actions/ui';

export default ({ dispatch, getState }) => {
    const handleRoute = ({ location, params }) => {
        const {
            roomId,
        } = params;

        if (roomId) {
            dispatch(Room.join({ id: roomId }));
        } else if (location.pathname === '/') {
            dispatch(Room.leave());
            dispatch(Room.fetch());
        }
    };

    return next => (action) => {
        const {
            type,
            payload,
        } = action;

        switch (type) {
        case ROUTER_DID_CHANGE:
            dispatch(UI.drawer(false));
            handleRoute(payload);
            break;
        case Socket.RECONNECT:
            handleRoute(getState().router);
            break;
        default:
            break;
        }

        return next(action);
    };
};
