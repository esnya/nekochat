import * as Route from '../actions/route';
import AppStore from './store';

export const set = function(path) {
    AppStore.dispatch(Route.set(path));
};

export const run = function() {
    set(location.pathname);
    window.addEventListener('popstate', () => set(location.pathname));
};
