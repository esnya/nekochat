import IconButton from 'material-ui/IconButton';
import Feedback from 'material-ui/svg-icons/action/feedback';
import React, { PropTypes } from 'react';
import Config from '../browser/config';
import dialogButton from '../connectors/dialog-button';
import { staticRender } from '../utility/enhancer';

const FeedbackButton = (props) => {
    if (!Config.feedback_form) return null;

    const {
        color,
        onOpenDialog,
        ...others,
    } = props;

    return (
        <IconButton
            {...others}
            tooltip="Send Feedback"
            onTouchTap={() => onOpenDialog()}
        >
            <Feedback color={color} />
        </IconButton>
    );
};
FeedbackButton.propTypes = {
    onOpenDialog: PropTypes.func.isRequired,
    color: PropTypes.string,
};
export default dialogButton('feedback')(staticRender(FeedbackButton));
