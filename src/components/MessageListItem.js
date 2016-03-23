import Colors from 'material-ui/lib/styles/colors';
import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { makeColor } from '../utility/color';
import { MessageIcon } from '../containers/MessageIconContainer';
import {
    CharacterLinkButton,
} from '../containers/CharacterLinkButtonContainer';
import { Timestamp } from './Timestamp';
import { UserId } from './UserId';

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

export const MessageBody = ({message, whisper_to, whisperTo}) => {
    const messageStyle = {
        ...Style.ListItem.Message,
        color: whisper_to && Colors.deepOrange500,
    };

    const innerElement = (
            Array.isArray(message)
                ? message
                : (message || '')
                    .split(/\r\n|\n/)
                    .map((line) => [{ text: line }])
        ).map((line, l) => (
            <p key={l} style={Style.ListItem.Line}>
                {
                    (whisper_to && l === 0)
                        ? (
                        <UserId
                            style={Style.ListItem.UserId}
                            user_id={whisper_to}
                            whisperTo={whisperTo}
                        />
                        ) : null
                }
                {
                    line.map((node, n) =>
                        <span key={n}>{node.text}</span>
                    )
                }
            </p>
        ));

    return (
        <div style={messageStyle}>
            {innerElement}
        </div>
    );
};
MessageBody.propTypes = {
    message: PropTypes.array.isRequired,
    whisperTo: PropTypes.func.isRequired,
    whisper_to: PropTypes.string,
};

export class MessageListItem extends Component {
    static get propTypes() {
        return {
            created: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.timestamp,
            ]),
            file_id: PropTypes.string,
            icon_id: PropTypes.string,
            iconType: PropTypes.string,
            character_url: PropTypes.string,
            message: PropTypes.array.isRequired,
            modified: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.timestamp,
            ]),
            name: PropTypes.string,
            scroll: PropTypes.func.isRequired,
            user_id: PropTypes.string.isRequired,
            whisper_to: PropTypes.string,
            whisperTo: PropTypes.func.isRequired,
        };
    }

    componentDidMount() {
        const element = findDOMNode(this.message);

        this.props.scroll(element.offsetTop, element.offsetHeight);
    }

    shouldComponentUpdate(nextProps) {
        return !(this.props.modified > nextProps.modified);
    }

    onWhisperTo(e, whisper_to) {
        e.preventDefault();
        this.props.whisperTo(whisper_to);
    }

    render() {
        const {
            file_id,
            icon_id,
            iconType,
            character_url,
            message,
            name,
            user_id,
            whisper_to,
            created,
            whisperTo,
        } = this.props;

        const color = makeColor(`${name}${user_id}`);

        const fileElement = file_id && (
            <img src={`/file/${file_id}`} />
        );

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
                    />
                </div>
                <div style={Style.ListItem.MessageContainer}>
                    <div style={Style.ListItem.Header}>
                        <span style={{color}}>{name}</span>
                        <UserId user_id={user_id} whisperTo={whisperTo} />
                        <CharacterLinkButton character_url={character_url} />
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
                        whisperTo={whisperTo}
                        whisper_to={whisper_to}
                    />
                    {fileElement}
                </div>
                <div style={Style.ListItem.Timestamp}>
                    {
                        created &&
                            <Timestamp
                                horizontalPosition="left"
                                timestamp={created}
                            />
                    }
                </div>
            </div>
        );
    }
}
