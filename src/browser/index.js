import React from 'react';
import injectTouchTapEvent from 'react-tap-event-plugin';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ReduxRouter } from 'redux-router';
import routes from './routes';
import store from './store';

import './window-event';
import './moment';

if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line global-require
    require('./debug');
}

injectTouchTapEvent();

render(
    <Provider store={store}>
        <ReduxRouter>
            {routes}
        </ReduxRouter>
    </Provider>,
    document.getElementById('app')
);
