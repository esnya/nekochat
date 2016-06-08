import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import Store from '../browser/store';
import App from './App';

render(
    <Provider store={Store}><App /></Provider>,
    document.getElementById('app')
);
