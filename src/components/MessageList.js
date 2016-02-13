import CircularProgress from 'material-ui/lib/circular-progress';
import IconButton from 'material-ui/lib/icon-button';
import Colors from 'material-ui/lib/styles/colors';
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { makeColor } from '../utility/color';
import { MessageIcon } from '../containers/MessageIconContainer';
import { Timestamp } from './Timestamp';

const Style = {
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
    ListItem: {
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
        WhisperArrow: {
            margin: '0 16px',
        },
        WhisperTo: {
            color: Colors.deepOrange500,
        },
        UserLink: {
            color: Colors.grey600,
            textDecoration: 'none',
            cursor: 'pointer',
        },
    },
};

export const UserId = ({user_id, whisperTo}) => (
    <span
        style={Style.ListItem.UserLink}
        onTouchTap={(e) => {
            e.preventDefault();
            whisperTo(user_id);
        }}
    >
        <span>@</span>
        <span>{user_id}</span>
    </span>
);

export const MessageBody = ({message, whisper_to, whisperTo}) => {
    const messageStyle = {
        ...Style.ListItem.Message,
        color: whisper_to && Colors.deepOrange500,
    };

    return (
        <div style={messageStyle}>
            {message && message.split(/\r\n|\n/).map((line, i) => {
                let body = line;
                if (i === 0 && line.charAt(0) === '@') {
                    const m = line.match(/^@([^ ]+) (.*)$/);

                    if (m) {
                        body = [
                            <UserId
                                key="whisperTo"
                                user_id={m[1]}
                                whisperTo={whisperTo} />,
                            <span
                                key="line"
                                style={{marginLeft: 8}}
                            >
                                {m[2]}
                            </span>,
                        ];
                    }
                } else if (line.match(/^https?:\/\/[^ ]+$/)) {
                    body = <a href={line} target="_blank">{line}</a>;
                }

                return (
                    <p key={i} style={Style.ListItem.Line}>
                        {body}
                    </p>
                );
            })}
        </div>
    );
};

export class MessageListItem extends Component {
    componentDidMount() {
        const element = findDOMNode(this.refs.message);

        this.props.scroll(element.offsetTop, element.offsetHeight);
    }

    onWhisperTo(e, whisper_to) {
        e.preventDefault();
        this.props.whisperTo(whisper_to);
    }

    render() {
        const {
            icon_id,
            iconType,
            character_data,
            character_url,
            message,
            name,
            user_id,
            whisper_to,
            created,
            whisperTo,
        } = this.props;

        const href = character_data &&
            new URL(character_data.url, character_url) || character_url;
        const color = makeColor(`${name}${user_id}`);

        return (
            <div ref="message" style={Style.ListItem.ListItem}>
                <div style={Style.ListItem.Icon}>
                    <MessageIcon
                        id={icon_id}
                        character_data={character_data}
                        character_url={character_url}
                        color={color}
                        name={name}
                        type={iconType} />
                </div>
                <div style={Style.ListItem.MessageContainer}>
                    <div style={Style.ListItem.Header}>
                        <span style={{color}}>{name}</span>
                        <UserId user_id={user_id} whisperTo={whisperTo} />
                        {href && <IconButton
                            containerElement="a"
                            href={href}
                            target="_blank"
                            style={Style.ListItem.Link}
                            iconClassName="material-icons"
                            iconStyle={Style.ListItem.LinkIcon} >
                            open_in_new
                        </IconButton>}
                        {
                            whisper_to &&
                            <span>
                                <span style={Style.ListItem.WhisperArrow}>
                                    &gt;
                                </span>
                                <span style={Style.ListItem.WhisperTo}>
                                    {whisper_to}
                                </span>
                            </span>
                        }
                    </div>
                    <MessageBody
                        message={message}
                        whisper_to={whisper_to}
                        whisperTo={whisperTo} />
                </div>
                <div style={Style.ListItem.Timestamp}>
                    {
                        created &&
                            <Timestamp
                                timestamp={created}
                                horizontalPosition="left" />
                    }
                </div>
            </div>
        );
    }
}

export class MessageList extends Component {
    componentDidUpdate(prevProps) {
        if (!this.props.eor &&
            this.props.messageList.length > 0 &&
            prevProps.messageList.length === 0) {
            this.onScroll({
                target: findDOMNode(this.refs.messageList),
            });
        }
    }

    onScroll() {
        const list = findDOMNode(this.refs.messageList);

        if (list.scrollTop === 0) {
            const {
                eor,
                messageList,
                fetch,
            } = this.props;

            if (eor || !messageList[0]) return;

            fetch(messageList[0].id);
        }
    }

    scroll(top, height) {
        const list = findDOMNode(this.refs.messageList);

        if (
            top - height / 2 <=
                list.offsetTop + list.offsetHeight + list.scrollTop
        ) {
            list.scrollTop += height + top -
                (list.offsetTop + list.offsetHeight + list.scrollTop);
        }
    }

    render() {
        const {
            input,
            eor,
            messageList,
            whisperTo,
        } = this.props;

        return (
            <div
                ref="messageList"
                style={Style.List}
                onScroll={(e) => this.onScroll(e)}>
                <div ref="loader" style={{
                    ...Style.Loader,
                    display: eor ? 'none' : 'block',
                }}>
                    <CircularProgress />
                </div>
                {messageList.map((message) => (
                    <MessageListItem
                        {...message}
                        key={message.id}
                        scroll={(t, s) => this.scroll(t, s)}
                        whisperTo={whisperTo} />
                ))}
                {input.map((i) => (
                    <MessageListItem
                        {...i}
                        key={i.id}
                        iconType="loading"
                        scroll={(t, s) => this.scroll(t, s)}
                         whisperTo={whisperTo} />
                ))}
            </div>
        );
    }
}