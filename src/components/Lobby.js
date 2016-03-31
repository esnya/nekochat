import AppBar from 'material-ui/lib/app-bar';
import IconButton from 'material-ui/lib/icon-button';
import React, { PropTypes } from 'react';
import { RoomListContainer } from '../containers/RoomListContainer';

export const Lobby = ({open}) => {
    document.title = "Nekochat";

    const Style = {
        Container: {
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            WebkitOverflowScrolling: 'touch',
        },
        RoomList: {
            flex: '1 1 auto',
            overflow: 'auto',
        },
    };

    return (
        <div style={Style.Container}>
            <AppBar
                iconElementLeft={
                    <a href="/">
                        <img src="/img/nekokoro48.png" />
                    </a>
                }
                iconElementRight={
                    <IconButton
                        iconClassName="material-icons"
                        id="button-open-create-room-dialog"
                        onTouchTap={() => open('room-create')}
                    >
                        add
                    </IconButton>
                }
                title="Nekochat"
            />
            <div id="notification-anchor" />
            <RoomListContainer style={Style.RoomList} />
        </div>
    );
};
Lobby.propTypes = {
    open: PropTypes.func.isRequired,
};
