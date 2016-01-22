import * as Route from '../actions/RouteActions';
import { AppStore } from './stores/AppStore';

export const set = function(path) {
    AppStore.dispatch(Route.set(path));
};

export const run = function() {
    set(location.pathname);
    window.addEventListener('popstate', () => set(location.pathname));
};