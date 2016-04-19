import AppBar from 'material-ui/lib/app-bar';
import FontIcon from 'material-ui/lib/font-icon';
import IconButton from 'material-ui/lib/icon-button';
import LeftNav from 'material-ui/lib/left-nav';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Colors from 'material-ui/lib/styles/colors';
import Divider from 'material-ui/lib/divider';
import React, { Component, PropTypes } from 'react';
import { FROM_HEIGHT } from '../components/MessageForm';
import { MessageFormContainer } from '../containers/MessageFormContainer';
import {Notes} from '../containers/notes';
import { MessageList } from '../containers/MessageList';

export const UserListItem = (props) => {
    const {
        id,
        name,
        login,
        timestamp,
    } = props;

    const IconStyle = {
        display: 'block',
    };
    const color = (Date.now() - timestamp) < 3 * 60 * 1000
        ? Colors.green500
        : Colors.yellow500;

    const iconElement = login
        ? (
        <FontIcon className="material-icons" style={{...IconStyle, color}}>
            person
        </FontIcon>
        ) : (
        <FontIcon
            className="material-icons"
            style={{...IconStyle, color: Colors.grey500}}
        >
            person_outline
        </FontIcon>
        );

    return (
        <MenuItem>
            <div style={{display: 'flex', alignItems: 'center'}}>
                <span>{iconElement}</span>
                <span>{name}@{id}</span>
            </div>
        </MenuItem>
    );
};
UserListItem.propTypes = {
    id: PropTypes.string.isRequired,
    login: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    timestamp: PropTypes.number.isRequired,
};

export class Chat extends Component {
    static get propTypes() {
        return {
            id: PropTypes.string,
            dom: PropTypes.object.isRequired,
            messageForm: PropTypes.array.isRequired,
            messageList: PropTypes.array.isRequired,
            state: PropTypes.string,
            title: PropTypes.string,
            user: PropTypes.shape({
                id: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired,
            }).isRequired,
            user_id: PropTypes.string,
            users: PropTypes.arrayOf(PropTypes.shape({
                id: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired,
                login: PropTypes.bool.isRequired,
                timestamp: PropTypes.number.isRequired,
            })).isRequired,
            setRoute: PropTypes.func.isRequired,
            onFetchUser: PropTypes.func.isRequired,
            onRoomEdit: PropTypes.func.isRequired,
        };
    }

    constructor(props) {
        super(props);

        this.unreadBase = null;
        this.state = {
            leftNav: false,
        };
    }

    toggleLeftNav() {
        const {leftNav} = this.state;

        if (!leftNav) this.props.onFetchUser();

        this.setState({leftNav: !leftNav});
    }

    setTitle() {
        const {
            title,
            messageList,
        } = this.props;

        if (this.unreadBase !== null && messageList.length > this.unreadBase) {
            document.title =
                `(${messageList.length - this.unreadBase}) ${title} - Nekochat`;
        } else if (title) {
            document.title = `${title} - Nekochat`;
        }
    }

    render() {
        const {
            id,
            dom,
            messageForm,
            messageList,
            state,
            title,
            user_id,
            user,
            users,
            setRoute,
            onRoomEdit,
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
            Title: {
                display: 'flex',
                alignItems: 'center',
            },
        };

        if (dom.focused) {
            this.prevMsgs = messageList.length;
            document.title = `${title} - Nekochat`;
        } else if (messageList.length > this.prevMsgs) {
            document.title =
                `(${messageList.length - this.prevMsgs}) ${title} - Nekochat`;
        }

        const formDisabled = state !== 'open' && user.id !== user_id;
        const closeIcon = state !== 'open' ? (
            <FontIcon
                className="material-icons"
                style={{color: 'white'}}
            >
                block
            </FontIcon>
        ) : null;
        const titleElement = title ? (
            <div style={Styles.Title}>
                <div>{title}</div>
                {closeIcon}
            </div>
        ) : 'Nekochat';

        return (
            <div style={Styles.Container}>
                <AppBar
                    iconElementRight={
                        user_id !== user.id ? null : (
                            <IconButton
                                iconClassName="material-icons"
                                onTouchTap={onRoomEdit}
                            >
                                mode_edit
                            </IconButton>
                        )
                    }
                    title={titleElement}
                    onLeftIconButtonTouchTap={() => this.toggleLeftNav()}
                />
                <div id="notification-anchor" />
                <div style={{flex: '0 0 auto', maxHeight: '160px'}}>
                    <Notes />
                </div>
                <MessageList />
                <div style={Styles.FormList}>
                    {messageForm.map((form) => (
                        <MessageFormContainer
                            {...form}
                            disabled={formDisabled}
                            key={form.id}
                            user={user}
                        />
                    ))}
                </div>
                <LeftNav
                    docked={false}
                    open={leftNav}
                    onRequestChange={() => this.toggleLeftNav()}
                >
                    <AppBar
                        iconElementLeft={(
                            <IconButton
                                iconClassName="material-icons"
                                onTouchTap={() => this.toggleLeftNav()}
                            >
                                close
                            </IconButton>
                        )}
                        title="Nekochat"
                    />
                    <MenuItem href="/" onTouchTap={(e) => setRoute('/', e)}>
                        Leave
                    </MenuItem>
                    <MenuItem
                        href={`/view/${id}`}
                        target="_blank"
                    >
                        Text View
                    </MenuItem>
                    <Divider />
                    {users.map((u) => <UserListItem {...u} key={u.id} />)}
                </LeftNav>
            </div>
        );
    }
}
