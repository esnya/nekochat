import * as Colors from 'material-ui/styles/colors';
import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import IPropTypes from 'react-immutable-proptypes';
import MessageIcon from '../containers/MessageIcon';
import { makeColor } from '../utility/color';
import { Timestamp } from './Timestamp';
import MessageAttachedFile from './MessageAttachedFile';
import MessageBody from './MessageBody';
import MessageHeader from './MessageHeader';
import { pureRender } from '../utility/enhancer';

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
        UserId: {
            marginRight: '0.5em',
        },
    },
};

class MessageListItem extends Component {
    static get propTypes() {
        return {
            message: IPropTypes.contains({
                created: PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.number,
                ]),
                icon_id: PropTypes.string,
                iconType: PropTypes.string,
                character_url: PropTypes.string,
                message: IPropTypes.list.isRequired,
                modified: PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.number,
                ]),
                name: PropTypes.string,
                user_id: PropTypes.string.isRequired,
                whisper_to: PropTypes.string,
            }),
            typing: PropTypes.bool,
            onScroll: PropTypes.func.isRequired,
        };
    }

    componentDidMount() {
        const element = findDOMNode(this.message);

        this.props.onScroll(element.offsetTop, element.offsetHeight);
    }

    render() {
        const {
            message,
            typing,
        } = this.props;
        const {
            icon_id,
            iconType,
            character_url,
            name,
            user_id,
        } = message.toJS();

        const color = makeColor(`${name}${user_id}`);

        return (
            <div
                ref={(c) => c && (this.message = c)}
                style={Style.ListItem.ListItem}
            >
                <div style={Style.ListItem.Icon}>
                    <MessageIcon
                        character_url={character_url}
                        color={color}
                        id={icon_id}
                        name={name}
                        type={iconType}
                        typing={typing}
                    />
                </div>
                <div style={Style.ListItem.MessageContainer}>
                    <div style={Style.ListItem.Header}>
                        <MessageHeader message={message} />
                    </div>
                    <MessageBody message={message} />
                    <MessageAttachedFile message={message} />
                </div>
                <div style={Style.ListItem.Timestamp}>
                    <Timestamp
                        horizontalPosition="left"
                        timestamp={
                            message.get('created') || message.get('timestamp')
                        }
                    />
                </div>
            </div>
        );
    }
}
export default pureRender(MessageListItem);
