import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import middlewares from '../middlewares';
import reducers from '../reducers';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();

export default createStore(reducers, composeWithDevTools(
    applyMiddleware(sagaMiddleware, ...middlewares),
));

sagaMiddleware.run(rootSaga);
