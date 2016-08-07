import { Map } from 'immutable';
import * as Colors from 'material-ui/styles/colors';
import React, { Component, PropTypes } from 'react';
import IPropTypes from 'react-immutable-proptypes';
import { findDOMNode } from 'react-dom';
import { pureRender } from '../utility/enhancer';
import MessageListItem from './MessageListItem';
import MessageLoadingProgress from './MessageLoadingProgress';

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

class MessageList extends Component {
    static get propTypes() {
        return {
            typings: PropTypes.instanceOf(Map).isRequired,
            first_message: PropTypes.number,
            messages: IPropTypes.listOf(IPropTypes.contains({
                id: PropTypes.number.isRequired,
            })).isRequired,
            onFetchLog: PropTypes.func.isRequired,
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.messages.length > 0 &&
            prevProps.messages.length === 0) {
            this.onScroll({
                target: findDOMNode(this.messages),
            });
        }
    }

    onScroll() {
        const list = findDOMNode(this.messages);

        if (list.scrollTop === 0) {
            const {
                first_message,
                messages,
                onFetchLog,
            } = this.props;

            const first = messages.first();

            // eslint-disable-next-line camelcase
            if (!first || first_message === first.get('id')) return;

            onFetchLog(first.get('id'));
        }
    }

    scroll(top, height) {
        const list = findDOMNode(this.messages) || {
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
            typings,
            messages,
        } = this.props;

        return (
            <div
                ref={(c) => c && (this.messages = c)}
                style={Style.List}
                onScroll={(e) => this.onScroll(e)}
            >
                <div style={Style.Loader}>
                    <MessageLoadingProgress />
                </div>
                {
                    messages.map((message) => (
                        <MessageListItem
                            key={message.get('id')}
                            message={message}
                            onScroll={(t, s) => this.scroll(t, s)}
                        />
                    ))
                }
                {
                    typings.map((typing) => (
                        <MessageListItem
                            typing
                            iconType="loading"
                            key={typing.get('id')}
                            message={typing}
                            onScroll={(t, s) => this.scroll(t, s)}
                        />
                    )).toList()
                }
            </div>
        );
    }
}
export default pureRender(MessageList);
