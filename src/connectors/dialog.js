import { mapValues } from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    ok as onOK,
    close as onClose,
} from '../actions/dialog';

/**
 * Dialog connector
 * @param{string} type - Dialog Type
 * @param{object} options - Optons for connect
 * @returns{function} Connector
 */
export default (type, options) => connect(
    ({ dialogs }) => {
        const dialog = dialogs.first();
        if (!dialog) return { open: false };

        if (dialog.get('type') !== type) return { open: false };

        return {
            open: true,
            dialog,
        };
    },
    dispatch => bindActionCreators({
        onOK,
        onClose,
    }, dispatch),
    (state, dispatch, own) => ({
        ...own,
        ...state,
        ...mapValues(dispatch, action =>
            () => state.dialog && action(state.dialog.get('id')),
        ),
    }),
    options,
);
