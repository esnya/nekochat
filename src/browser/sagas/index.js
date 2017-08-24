// @flow
import { fork } from 'redux-saga/effects';
import { createBrowserHistory as createHistory, saga as routerSaga } from 'redux-tower';
import routes from '../routes';

export default function* rootSaga() {
    const history = createHistory();
    yield fork(routerSaga, { history, routes });
}
