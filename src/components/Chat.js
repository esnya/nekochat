import {
    AppBar,
    CircularProgress,
    IconButton,
    LeftNav,
    MenuItem,
} from 'material-ui';
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { makeColor } from '../utility/color';
import moment from '../browser/moment';
import { FROM_HEIGHT } from '../components/MessageForm';
import { MessageFormContainer } from '../containers/MessageFormContainer';
import { MessageIcon } from './MessageIcon';

export const Message = (props) => {
    const Styles = {
        ListItem: {
            display: 'flex',
            padding: '8px 0',
        },
        Icon: {
            flex: '0 0 auto',
            padding: '0 8px',
        },
        MessageContainer: {
            flex: '1 1 auto',
        },
        Header: {
            display: 'flex',
            alignItems: 'center',
            color: 'rgba(0, 0, 0, 0.54)',
            fontSize: 14,
            height: 27,
        },
        Link: {
            margin: '0 4px',
            padding: 0,
            width: 'auto', height: 'auto',
        },
        LinkIcon: {
            color: 'rgba(0, 0, 0, 0.54)',
            fontSize: 18,
        },
        Message: {
        },
        Line: {
            margin: 0,
        },
        Timestamp: {
            flex: '0 0 auto',
            padding: '0 8px',
        },
    };

    const {
        icon_id,
        iconType,
        character_data,
        character_url,
        message,
        name,
        user_id,
        created,
    } = props;

    const href = character_data
        && new URL(character_data.url, character_url) || character_url;
    const color = makeColor(`${name}${user_id}`);

    return (
        <div style={Styles.ListItem}>
            <div style={Styles.Icon}>
                <MessageIcon
                    id={icon_id}
                    character_data={character_data}
                    character_url={character_url}
                    color={color}
                    name={name}
                    type={iconType} />
            </div>
            <div style={Styles.MessageContainer}>
                <div style={Styles.Header}>
                    <span style={{color}}>{name}</span>
                    <span>@</span>
                    <span>{props.user_id}</span>
                    {href && <IconButton
                        containerElement="a"
                        href={href}
                        target="_blank"
                        style={Styles.Link}
                        iconClassName="material-icons"
                        iconStyle={Styles.LinkIcon} >
                        open_in_new
                    </IconButton>}
                </div>
                <div style={Styles.Message}>
                    {message && message.split(/\r\n|\n/).map((line, i) => (
                        <p key={i} style={Styles.Line}>
                            {
                                line.match(/^https?:\/\/[^ ]+$/)
                                ? <a href={line} target="_blank">{line}</a>
                                : line
                            }
                        </p>
                    ))}
                </div>
            </div>
            <div style={Styles.Timestamp}>
                    {created && moment(created).fromNow()}
            </div>
        </div>
    );
};

export class Chat extends Component {
    constructor(props) {
        super(props);

        this.unreadBase = null;
        this.state = {
            leftNav: false,
        };
    }

    componentDidUpdate(prevProps) {
        if (!this.props.eor
            && this.props.messageList.length > 0
            && prevProps.messageList.length === 0) {
            this.onScroll({
                target: findDOMNode(this.refs.messageList),
            });
        }
    }

    onScroll(e) {
        const loader = findDOMNode(this.refs.loader);
        const list = e.target;

        if (list.scrollTop + list.offsetHeight
            >= loader.offsetTop - list.offsetTop + loader.offsetHeight) {
            const {
                eor,
                messageList,
                fetch,
            } = this.props;

            if (eor) return;
            fetch(messageList[messageList.length - 1].id);
        }
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
                `(${messageList.length - this.unreadBase}) ${title} - Beniimo Online`;
        } else if (title) {
            document.title = `${title} - Beniimo Online`;
        }
    }

    render() {
        const {
            eor,
            id,
            dom,
            input,
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
            List: {
                flex: '1 1 auto',
                overflow: 'hidden',
                overflowY: 'auto',
                WebkitOverflowScrolling: 'touch',
            },
            Loader: {
                textAlign: 'center',
                overflow: 'hidden',
            },
        };

        if (dom.focused) {
            this.prevMsgs = messageList.length;
            document.title = `${title} - Beniimo Online`;
        } else if (messageList.length > this.prevMsgs) {
            document.title =
                `(${messageList.length - this.prevMsgs}) ${title} - Beniimo Online`;
        }

        return (
            <div style={Styles.Container}>
                <AppBar
                    title={title || 'Beniimo Online'}
                    onLeftIconButtonTouchTap={() => this.toggleLeftNav()} />
                <div style={Styles.FormList}>
                    {messageForm.map((form) => (
                        <MessageFormContainer
                            {...form}
                            key={form.id}
                            user={user} />
                    ))}
                </div>
                <div
                    ref="messageList"
                    style={Styles.List}
                    onScroll={(e) => this.onScroll(e)}>
                    {input.map((i) => (
                        <Message {...i} key={i.id} iconType="loading" />
                    ))}
                    {messageList.map((message) => (
                        <Message {...message} key={message.id} />
                    ))}
                    <div ref="loader" style={Object.assign({
                        display: eor ? 'none' : 'block',
                    }, Styles.Loader)}>
                        <CircularProgress />
                    </div>
                </div>
                <LeftNav open={leftNav} docked={false}>
                    <AppBar
                        title={title || 'Beniimo Online'}
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