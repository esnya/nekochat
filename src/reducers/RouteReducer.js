import * as Route from '../../actions/RouteActions';
import * as ROUTE from '../../constants/RouteActions';
import * as ROOM from '../../constants/RoomActions';
import { Routes } from '../routes';

const parse = function(path) {
    const s = path.split('/').slice(1);

    return Object.assign(
        Routes.map((route) => {
            const t = route.path.split('/').slice(1);
            
            if (s.length !== t.length) return null;

            const params = {};

            for (let i = 0; i < s.length; i++) {
                if (t[i].charAt(0) === ':') {
                    params[t[i].substr(1)] = s[i];
                } else if (s[i] !== t[i]) return null;
            }

            return Object.assign({params}, route);
        })
        .find((route) => route !== null) || {}, {path});
};

export const routeReducer = function(state = parse(location.pathname), action) {
    switch (action.type) {
        case ROUTE.SET: {
            const path = action.path.charAt(0) === '/'
                ? action.path
                : `/${action.path}`;

            if (path !== location.pathname) {
                history.pushState({}, 'Beniimo online', path);
            }
            return parse(path);
        } case ROOM.CREATED:
        case ROOM.JOINED:
            return routeReducer(state, Route.set(action.room.id));
        default:
            return state;
    }
};