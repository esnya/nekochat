import AppBar from 'material-ui/AppBar';
import React from 'react';
import RoomCreateButton from '../containers/RoomCreateButton';
import RoomList from '../containers/RoomList';
import { staticRender } from '../utility/enhancer';

const Lobby = () => {
    document.title = "Nekochat";

    const Style = {
        Container: {
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
        },
        AppBar: {
            flex: '0 0 auto',
        },
        RoomList: {
            flex: '1 1 auto',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
        },
    };

    return (
        <div style={Style.Container}>
            <div style={Style.AppBar}>
                <AppBar
                    iconElementLeft={
                        <a href="/">
                            <img src="/img/nekokoro48.png" />
                        </a>
                    }
                    iconElementRight={<RoomCreateButton />}
                    title="Nekochat"
                />
            </div>
            <div id="notification-anchor" />
            <div style={Style.RoomList}>
                <RoomList />
            </div>
        </div>
    );
};
export default staticRender(Lobby);
