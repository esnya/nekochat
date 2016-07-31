import { createHistory } from 'history';
import { applyMiddleware, compose, createStore } from 'redux';
import { reduxReactRouter } from 'redux-router';
import middlewares from '../middlewares';
import reducer from '../reducers';

export default compose(
    reduxReactRouter({
        createHistory,
    }),
    applyMiddleware(...middlewares),
    window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore)(reducer);
