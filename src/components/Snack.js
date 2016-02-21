import FontIcon from 'material-ui/lib/font-icon';
import Snackbar from 'material-ui/lib/snackbar';
import React, { PropTypes } from 'react';
import { format } from '../utility/format';

export const Snack = (props) => {
    const {
        snackList,
        remove,
    } = props;
    const snack = snackList[0] || {};
    const message = snack.message && format(snack.message, snack.data) || '';

    const MessageStyle = {
        display: 'flex',
        alignItems: 'center',
        float: 'left',
    };
    const IconStyle = {
        marginRight: 8,
    };
    const SnackStyle = {
        left: '50%',
        width: 0,
        justifyContent: 'center',
    };

    return (
        <Snackbar
            action={snack.action || 'close'}
            autoHideDuration={5000}
            message={
                <div style={MessageStyle}>
                    {snack.icon && (
                        <FontIcon
                            className="material-icons"
                            color="white"
                            style={IconStyle}
                        >
                            {snack.icon}
                        </FontIcon>
                    )}
                    <div>{message}</div>
                </div>
            }
            open={snackList.length > 0}
            style={SnackStyle}
            onActionTouchTap={() => {
                if (snack.onAction) {
                    snack.onAction(snack.data);
                }
                remove(snack);
            }}
            onRequestClose={() => remove(snack)}
        />
    );
};
Snack.propTypes = {
    remove: PropTypes.func.isRequired,
    snackList: PropTypes.arrayOf(PropTypes.object).isRequired,
};