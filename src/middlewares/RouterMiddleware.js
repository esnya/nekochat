import * as ROUTE from '../constants/RouteActions';
import { parse } from '../router/Parser';

export const routerMiddleware = () => (next) => (action) => {
    if (action.type === ROUTE.SET && !action.route) {
        const {
            path,
            ...nextAction,
        } = action;
        const abs = (path.charAt(0) === '/')
            ? path
            : `/${path}`;

        if (abs !== location.pathname) {
            history.pushState({}, 'Beniimo Online', abs);
        }

        return next({
            ...nextAction,
            route: parse(abs),
        });
    }

    return next(action);
};