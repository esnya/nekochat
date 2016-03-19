import * as Route from '../actions/RouteActions';
import * as ROUTE from '../constants/RouteActions';
import * as ROOM from '../constants/RoomActions';
import { parse } from '../router/Parser';

const Redirects = {
    [ROOM.CREATED]: (action) => action.room.id,
};

export const routerMiddleware = ({dispatch}) => (next) => (action) => {
    if (action.type === ROUTE.SET && !action.route) {
        const {
            path,
            ...nextAction,
        } = action;
        const abs = (path.charAt(0) === '/')
            ? path
            : `/${path}`;

        if (abs !== location.pathname) {
            history.pushState({}, 'Nekochat', abs);
        }

        const route = parse(abs);

        if (route.onEnter) route.onEnter(dispatch)(route.params);

        return next({
            ...nextAction,
            route,
        });
    } else if (action.type in Redirects) {
        setTimeout(
            () => dispatch(Route.set(Redirects[action.type](action)))
        );
    }

    return next(action);
};
