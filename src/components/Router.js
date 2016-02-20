import React, { PropTypes } from 'react';
import { Lobby as lobby } from './Lobby';
import { ChatContainer as chat } from '../containers/ChatContainer';

const Handlers = {
    lobby,
    chat,
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
    route: PropTypes.string,
    params: PropTypes.object,
};