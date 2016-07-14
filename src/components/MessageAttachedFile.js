import React, { PropTypes } from 'react';
import IPropTypes from 'react-immutable-proptypes';
import { pureRender } from '../utility/enhancer';

const Style = {
    maxWidth: '100%',
    maxHeight: 600,
};

const MessageAttachedFile = (props) => {
    const {
        message,
    } = props;
    const fileId = message.get('file_id');

    if (!fileId) return null;

    return (
        <img alt={fileId} src={`/file/${fileId}`} style={Style} />
    );
};
MessageAttachedFile.propTypes = {
    message: IPropTypes.contains({
        file_id: PropTypes.string,
    }).isRequired,
};
export default pureRender(MessageAttachedFile);
