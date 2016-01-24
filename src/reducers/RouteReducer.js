import * as Route from '../actions/RouteActions';
import * as ROUTE from '../constants/RouteActions';
import * as ROOM from '../constants/RoomActions';
import { parse } from '../router/Parser';

export const routeReducer = function(state = parse(location.pathname), action) {
    switch (action.type) {
        case ROUTE.SET:
            if (!action.route) return state;
            return {
                ...action.route,
            };
        case ROOM.CREATED:
        case ROOM.JOINED:
            return routeReducer(state, Route.set(action.room.id));
        default:
            return state;
    }
};