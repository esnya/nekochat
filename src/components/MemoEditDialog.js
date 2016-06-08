import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import React, { PropTypes } from 'react';
import { singleState, pureRender } from '../utility/enhancer';

const MemoEditDialog = (props) => {
    const {
        memo,
        open,
        onChange,
        onClose,
        onUpdateMemo,
    } = props;

    const actions = [
        <FlatButton
            primary
            key="update"
            label="Update"
            onTouchTap={
                (e) => {
                    onUpdateMemo(e, memo);
                    onClose(e);
                }
            }
        />,
        <FlatButton
            key="cancel"
            label="Cancel"
            onTouchTap={onClose}
        />,
    ];

    return (
        <Dialog
            autoScrollBodyContent
            actions={actions}
            open={open}
            title="Edit Memo"
            onRequestClose={onClose}
        >
            <TextField
                fullWidth
                multiLine
                floatingLabelText="Memo"
                value={memo}
                onChange={onChange}
            />
        </Dialog>
    );
};
MemoEditDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onUpdateMemo: PropTypes.func.isRequired,
    memo: PropTypes.string,
};
export default singleState(pureRender(MemoEditDialog), 'memo', {
    watchProps: true,
});
