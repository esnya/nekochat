import React from 'react';
import Memo from '../containers/Memo';
import ChatAppBar from '../containers/ChatAppBar';
import ChatDrawer from '../containers/ChatDrawer';
import MessageList from '../containers/MessageList';
import MessageFormList from '../containers/MessageFormList';
import { staticRender } from '../utility/enhancer';
import './ChatDrawer';

const Style = {
    Container: {
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
};

const Chat = () => (
    <div style={Style.Container}>
        <div style={{ flex: "0 0 auto" }}>
            <ChatAppBar />
        </div>
        <div id="notification-anchor" />
        <div style={{flex: '0 0 auto', maxHeight: '160px'}}>
            <Memo />
        </div>
        <MessageList />
        <ChatDrawer />
        <MessageFormList />
    </div>
);
export default staticRender(Chat);
