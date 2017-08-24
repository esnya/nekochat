// @flow
import React from 'react';
import injectTouchTapEvent from 'react-tap-event-plugin';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'redux-tower/lib/react';
import store from './store';
import App from '../components/App';

injectTouchTapEvent();

render(
    <Provider store={store}>
        <App>
            <Router />
        </App>
    </Provider>,
    document.getElementById('app'),
);
