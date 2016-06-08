import { CREATE } from '../actions/room';
import { set, SET } from '../actions/route';
import { parse } from '../router/Parser';

const Redirects = {
    [ CREATE ]: (action) => action.payload.id,
};

export default ({ dispatch }) => (next) => (action) => {
    if (action.type === SET && !action.route) {
        const {
            path,
            ...payload,
        } = action.payload;
        const abs = (path.charAt(0) === '/')
            ? path
            : `/${path}`;

        if (abs !== location.pathname) {
            history.pushState({}, 'Nekochat', abs);
        }

        const route = parse(abs);

        if (route.onEnter) route.onEnter(dispatch)(route.params);

        return next({
            ...action,
            payload: {
                ...payload,
                route,
            },
        });
    } else if (action.type in Redirects) {
        setTimeout(
            () => dispatch(set(Redirects[action.type](action)))
        );
    }

    return next(action);
};
