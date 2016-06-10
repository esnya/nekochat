import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import React, { PropTypes } from 'react';
import Config from '../browser/config';
import dialog from '../connectors/dialog';
import { pureRender } from '../utility/enhancer';

const FeedbackDialog = (props) => {
    if (!Config.feedback_form) return null;

    const {
        open,
        onClose,
    } = props;

    const actions = [
        <FlatButton
            primary
            key="close"
            label="Close"
            onTouchTap={onClose}
        />,
    ];

    const {
        feedback_form,
    } = Config;

    return (
        <Dialog
            actions={actions}
            bodyStyle={{ padding: 0 }}
            open={open && Boolean(feedback_form)}
            title="Feedback"
            onRequestClose={onClose}
        >
            <iframe
                height={window.innerHeight / 1.5}
                src={`${feedback_form}?embedded=true`}
                width="100%"
            >
                Loading... Please wait.
            </iframe>
        </Dialog>
    );
};
FeedbackDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};
export default dialog('feedback')(pureRender(FeedbackDialog));
