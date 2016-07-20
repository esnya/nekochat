import React from 'react';
import { IndexRoute, Route } from 'react-router';
import App from '../components/App';
import Chat from '../components/Chat';
import Guest from '../components/Guest';
import Lobby from '../components/Lobby';

export default (
    <Route path="/" component={App} >
        <IndexRoute component={Lobby} />
        <Route path="guest" component={Guest} />
        <Route path=":roomId" component={Chat} />
    </Route>
);
