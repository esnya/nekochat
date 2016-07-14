import * as Route from '../actions/route';
import AppStore from './store';

export const set = (path) =>
    AppStore.dispatch(Route.set(path));

export const run = () => {
    set(location.pathname);
    window.addEventListener('popstate', () => set(location.pathname));
};
