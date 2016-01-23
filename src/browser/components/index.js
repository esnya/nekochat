import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { AppStore } from '../stores/AppStore';
import { App } from './App';

render(
    <Provider store={AppStore}><App /></Provider>,
    document.getElementById('app')
);

/*
document.addEventListener('touchmove', (e) => {
    if (window.innerHeight >= document.body.scrollHeight) {
        e.preventDefault();
    }
}, false);

const preventScroll = (e) => {
    const scrollable = e.touches[0].target.getAttribute('data-scrollable');

    alert(scrollable);
    if (scrollable !== true && scrollable !== 'true') {
        e.preventDefault();
    }
};

[
    'touchstart',
    'touchmove',
    'touchend',
    'gesturestart',
    'gesturechange',
    'gestureend',
].forEach((event) => document.addEventListener(event, preventScroll));
*/