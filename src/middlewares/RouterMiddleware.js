import * as ROUTE from '../constants/RouteActions';
import { parse } from '../router/Parser';

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
            history.pushState({}, 'Beniimo Online', abs);
        }

        const route = parse(abs);
        
        if (route.onEnter) route.onEnter(dispatch)(route.params);
        return next({
            ...nextAction,
            route,
        });
    }

    return next(action);
};