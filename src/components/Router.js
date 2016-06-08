import IPropTypes from 'react-immutable-proptypes';
import React, { PropTypes } from 'react';
import lobby from './Lobby';
import chat from './Chat';
import { Guest as guest } from './guest';

const Handlers = {
    lobby,
    chat,
    guest,
};

const Router = ({ route }) => {
    const Handler = Handlers[route.get('route')] || 'div';

    return Handler
        ? <Handler {...route.get('params')} />
        : <div>Loading...</div>;
};
Router.propTypes = {
    route: IPropTypes.contains({
        params: PropTypes.object,
        route: PropTypes.string,
    }).isRequired,
};
export default Router;
