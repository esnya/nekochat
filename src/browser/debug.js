import React from 'react';
import Perf from 'react-addons-perf';
import { whyDidYouUpdate } from 'why-did-you-update';
import localStorage from './localStorage';

window.Perf = Perf;

const wdyu = new RegExp(localStorage.getItem('nekochat:wdyu'));

if (wdyu) {
    whyDidYouUpdate(React, {
        include: wdyu,
        exclude: /^(Connect|^TouchRipple|^EnhancedButton)/,
    });
}
