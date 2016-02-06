import { CircularProgress, IconButton, Styles } from 'material-ui';
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import moment from '../browser/moment';
import { makeColor } from '../utility/color';
import { MessageIcon } from './MessageIcon';

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
            color: Styles.Colors.deepOrange500,
        },
    },
};

export class MessageListItem extends Component {
    componentDidMount() {
        const element = findDOMNode(this.refs.message);

        this.props.scroll(element.offsetTop, element.offsetHeight);
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
        } = this.props;

        const href = character_data &&
            new URL(character_data.url, character_url) || character_url;
        const color = makeColor(`${name}${user_id}`);

        const messageStyle = {
            ...Style.ListItem.Message,
            color: whisper_to && Styles.Colors.deepOrange500,
        };

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
                        <span>@</span>
                        <span>{user_id}</span>
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
                    <div style={messageStyle}>
                        {message && message.split(/\r\n|\n/).map((line, i) => (
                            <p key={i} style={Style.ListItem.Line}>
                                {
                                    line.match(/^https?:\/\/[^ ]+$/)
                                    ? <a href={line} target="_blank">{line}</a>
                                    : line
                                }
                            </p>
                        ))}
                    </div>
                </div>
                <div style={Style.ListItem.Timestamp}>
                        {created && moment(created).fromNow()}
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

            if (eor) return;

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
                        scroll={(t, s) => this.scroll(t, s)} />
                ))}
                {input.map((i) => (
                    <MessageListItem
                        {...i}
                        key={i.id}
                        iconType="loading"
                        scroll={(t, s) => this.scroll(t, s)} />
                ))}
            </div>
        );
    }
}