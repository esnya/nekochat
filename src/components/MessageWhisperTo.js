import { red500 } from 'material-ui/styles/colors';
import React, { PropTypes } from 'react';
import IPropTypes from 'react-immutable-proptypes';
import { pureRender } from '../utility/enhancer';

const Style = {
    Container: {
        color: red500,
    },
    Arrow: {
        margin: '0 8px',
    },
};

const MessageWhisperTo = (props) => {
    const {
        message,
    } = props;

    const whisperTo = message.get('whisper_to');
    if (!whisperTo) return null;

    return (
        <span style={Style.Container}>
            <span style={Style.Arrow}>{'>'}</span>
            <span>{whisperTo}</span>
        </span>
    );
};
MessageWhisperTo.propTypes = {
    message: IPropTypes.contains({
        user_id: PropTypes.string.isRequired,
        whisper_to: PropTypes.string,
    }).isRequired,
};

export default pureRender(MessageWhisperTo);
