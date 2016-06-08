import { applyMiddleware, createStore } from 'redux';
import middlewares from '../middlewares';
import reducer from '../reducers';

export default createStore(reducer, applyMiddleware(...middlewares));
