import React, {PropTypes} from 'react';
import {LobbyContainer as lobby} from '../containers/LobbyContainer';
import {ChatContainer as chat} from '../containers/ChatContainer';
import {Guest as guest} from './guest';

const Handlers = {
    lobby,
    chat,
    guest,
};

export const Router = (props) => {
    const {
        route,
        params,
    } = props;
    const Handler = Handlers[route] || 'div';

    return Handler ? <Handler {...params} /> : <div>Loading...</div>;
};
Router.propTypes = {
    params: PropTypes.object,
    route: PropTypes.string,
};
