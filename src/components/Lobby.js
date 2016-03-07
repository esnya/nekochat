import AppBar from 'material-ui/lib/app-bar';
import IconButton from 'material-ui/lib/icon-button';
import React, { PropTypes } from 'react';
import { RoomListContainer } from '../containers/RoomListContainer';

export const Lobby = ({open}) => {
    document.title = "NekoChat";

    return (
        <div>
            <AppBar
                iconElementLeft={
                    <a href="/">
                        <img src="/img/nekokoro48.png" />
                    </a>
                }
                iconElementRight={
                    <IconButton
                        iconClassName="material-icons"
                        onTouchTap={() => open('room-create')}
                    >
                        add
                    </IconButton>
                }
                title="NekoChat"
            />
            <div id="notification-anchor" />
            <RoomListContainer />
        </div>
    );
};
Lobby.propTypes = {
    open: PropTypes.func.isRequired,
};
