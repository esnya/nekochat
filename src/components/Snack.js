import { Snackbar } from 'material-ui';
import React from 'react';
import { format } from '../utility/format';

export const Snack = (props) => {
    const {
        snackList,
        remove,
    } = props;
    const snack = snackList[0] || {};
    const action = snack.action || 'close';
    const message = snack.message && format(snack.message, snack.data) || '';

    return (
        <Snackbar
            action={action}
            autoHideDuration={5000}
            message={message}
            open={snackList.length > 0}
            onActionTouchTap={() => remove(snack)}
            onRequestClose={() => remove(snack)} />
    );
}