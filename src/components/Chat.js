import {
    AppBar,
    IconButton,
    LeftNav,
    MenuItem,
} from 'material-ui';
import React, { Component } from 'react';
import { FROM_HEIGHT } from '../components/MessageForm';
import { MessageFormContainer } from '../containers/MessageFormContainer';
import { MessageList } from '../containers/MessageList';

export class Chat extends Component {
    constructor(props) {
        super(props);

        this.unreadBase = null;
        this.state = {
            leftNav: false,
        };
    }

    toggleLeftNav() {
        this.setState({leftNav: !this.state.leftNav});
    }

    setTitle() {
        const {
            title,
            messageList,
        } = this.props;

        if (this.unreadBase !== null && messageList.length > this.unreadBase) {
            document.title =
                `(${messageList.length - this.unreadBase}) ${title} - NekoChat`;
        } else if (title) {
            document.title = `${title} - NekoChat`;
        }
    }

    render() {
        const {
            id,
            dom,
            messageForm,
            messageList,
            title,
            user,
            setRoute,
        } = this.props;
        const {
            leftNav,
        } = this.state;

        const Styles = {
            Container: {
                overflow: 'hidden',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            },
            FormList: {
                flex: `0 0 ${FROM_HEIGHT * messageForm.length}px`,
            },
        };

        if (dom.focused) {
            this.prevMsgs = messageList.length;
            document.title = `${title} - NekoChat`;
        } else if (messageList.length > this.prevMsgs) {
            document.title =
                `(${messageList.length - this.prevMsgs}) ${title} - NekoChat`;
        }

        return (
            <div style={Styles.Container}>
                <AppBar
                    title={title || 'NekoChat'}
                    onLeftIconButtonTouchTap={() => this.toggleLeftNav()} />
                <div style={Styles.FormList}>
                    {messageForm.map((form) => (
                        <MessageFormContainer
                            {...form}
                            key={form.id}
                            user={user} />
                    ))}
                </div>
                <MessageList />
                <LeftNav open={leftNav} docked={false}>
                    <AppBar
                        title={title || 'NekoChat'}
                        iconElementLeft={(
                            <IconButton
                                iconClassName="material-icons"
                                onTouchTap={() => this.toggleLeftNav()}>
                                close
                            </IconButton>
                        )} />
                    <MenuItem onTouchTap={() => setRoute('/')}>Leave</MenuItem>
                    <MenuItem
                        href={`/view/${id}`}
                        target="_blank">
                        Static View
                    </MenuItem>
                </LeftNav>
            </div>
        );
    }
}