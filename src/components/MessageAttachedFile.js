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
    const fileType = message.get('file_type') || 'image/*';

    if (!fileId) return null;

    const src = `/file/${fileId}`;

    if (fileType.match(/^audio\//)) {
        return (
            <audio controls preload src={src} />
        );
    }

    return (
        <img alt={fileId} src={src} style={Style} />
    );
};
MessageAttachedFile.propTypes = {
    message: IPropTypes.contains({
        file_id: PropTypes.string,
    }).isRequired,
};
export default pureRender(MessageAttachedFile);
