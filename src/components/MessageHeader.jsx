import React, { PropTypes } from 'react';
import IPropTypes from 'react-immutable-proptypes';
import MessageWhisperTo from './MessageWhisperTo';
import { pureRender } from '../utility/enhancer';

const MessageHeader = (props) => {
    const {
        color,
        message,
    } = props;

    return (
        <div style={{ color }}>
            {message.get('name')}@{message.get('user_id')}
            <MessageWhisperTo message={message} />
        </div>
    );
};
MessageHeader.propTypes = {
    message: IPropTypes.contains({
        name: PropTypes.string.isRequired,
        user_id: PropTypes.string.isRequired,
    }).isRequired,
    color: PropTypes.string,
};

export default pureRender(MessageHeader);
