import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import React, { PropTypes } from 'react';
import IPropTypes from 'react-immutable-proptypes';
import { pureRender } from '../utility/enhancer';

const Confirm = (props) => {
    const {
        dialog,
        open,
        onOK,
        onClose,
    } = props;

    const actions = [
        <FlatButton primary
            key="ok"
            label="OK"
            onTouchTap={onOK}
        />,
        <FlatButton secondary
            key="cancel"
            label="Cancel"
            onTouchTap={onClose}
        />,
    ];

    return (
        <Dialog
            actions={actions}
            open={open}
            title={dialog && dialog.get('title')}
            onRequestClose={onClose}
        >
            {dialog && dialog.get('message')}
        </Dialog>
    );
};
Confirm.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onOK: PropTypes.func.isRequired,
    dialog: IPropTypes.contains({
        title: PropTypes.string.isRequired,
        message: PropTypes.string.isRequired,
    }),
};
export default pureRender(Confirm);
