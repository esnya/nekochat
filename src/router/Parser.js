import { zip } from 'lodash';
import { Routes } from './Routes';

export const parser = (routes) => (path) => {
    const s = path.split('/').slice(1);

    return routes.map((route) => {
        const t = route
            .path
            .split('/')
            .slice(1);

        if (s.length !== t.length) return false;

        const params = {};

        if (zip(s, t).every((u) => {
            if (u[1].charAt(0) === ':') {
                params[u[1].substr(1)] = u[0];
            } else if (u[0] !== u[1]) {
                return false;
            }

            return true;
        })) {
            return {
                ...route,
                params,
            };
        }

        return false;
    })
    .find((a) => a);
};

export const parse = parser(Routes);
