import CircularProgress from 'material-ui/lib/circular-progress';
import IconButton from 'material-ui/lib/icon-button';
import Colors from 'material-ui/lib/styles/colors';
import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { makeColor } from '../utility/color';
import { MessageIcon } from '../containers/MessageIconContainer';
import {
    CharacterLinkButton,
} from '../containers/CharacterLinkButtonContainer';
import { MessageListItem } from './MessageListItem';
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

export class MessageList extends Component {
    static get propTypes() {
        return {
            input: PropTypes.arrayOf(PropTypes.shape({
            })).isRequired,
            eor: PropTypes.bool,
            messageList: PropTypes.arrayOf(PropTypes.shape({
                id: PropTypes.number.isRequired,
            })).isRequired,
            whisperTo: PropTypes.func.isRequired,
            fetch: PropTypes.func,
        };
    }

    componentDidUpdate(prevProps) {
        if (!this.props.eor &&
            this.props.messageList.length > 0 &&
            prevProps.messageList.length === 0) {
            this.onScroll({
                target: findDOMNode(this.messageList),
            });
        }
    }

    onScroll() {
        const list = findDOMNode(this.messageList);

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
        const list = findDOMNode(this.messageList) || {
            offsetHeight: 0,
            offsetTop: 0,
            scrollTop: 0,
        };

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
                ref={(c) => c && (this.messageList = c)}
                style={Style.List}
                onScroll={(e) => this.onScroll(e)}
            >
                <div
                    style={{
                        ...Style.Loader,
                        display: eor ? 'none' : 'block',
                    }}
                >
                    <CircularProgress />
                </div>
                {messageList.map((message) => (
                    <MessageListItem
                        {...message}
                        key={message.id}
                        scroll={(t, s) => this.scroll(t, s)}
                        whisperTo={whisperTo}
                    />
                ))}
                {input.map((i) => (
                    <MessageListItem
                        {...i}
                        iconType="loading"
                        key={i.id}
                        scroll={(t, s) => this.scroll(t, s)}
                        whisperTo={whisperTo}
                    />
                ))}
            </div>
        );
    }
}