import * as ROUTE from '../constants/RouteActions';

export const set = function(path) {
    return {
        type: ROUTE.SET,
        path,
    };
};