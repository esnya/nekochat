import { applyMiddleware, createStore } from 'redux';
import { middlewares } from '../middlewares'
import { rootReducer } from '../reducers';

export const AppStore = 
    applyMiddleware(...middlewares)(createStore)(rootReducer);