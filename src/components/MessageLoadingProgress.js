import CircularProgress from 'material-ui/CircularProgress';
import React, { PropTypes } from 'react';
import connect from '../connectors/message-loading-progress';
import { pureRender } from '../utility/enhancer';

const MessageLoadingProgress = (props) => {
    const {
        isVisible,
        ...othres,
    } = props;

    return isVisible ? <CircularProgress {...othres} /> : null;
};
MessageLoadingProgress.propTypes = {
    isVisible: PropTypes.bool,
};
export default connect(pureRender(MessageLoadingProgress));
