import { Dialog, FlatButton } from 'material-ui';
import React from 'react';
import { format } from '../utility/format';

export const Confirm = (props) => {
    const {
        confirmList,
        ok,
        cancel,
    } = props;
    const confirm = confirmList[0] || {};

    const actions = [
        <FlatButton
            label="OK"
            primary={true}
            onTouchTap={() => ok(confirm.id)} />,
        <FlatButton
            label="Cancel"
            secondary={true}
            onTouchTap={() => cancel(confirm.id)} />,
    ];

    const message = confirm.message && format(confirm.message, confirm.next);

    return (
        <Dialog
            actions={actions}
            open={confirmList.length > 0}
            title={confirm.title} >
            {message}
        </Dialog>
    );
};