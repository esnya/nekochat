import { connect } from 'react-redux';
import { getDialog, close } from '../actions/DialogActions';
import {
    create as createIcon,
    fetch as fetchIcon,
    remove as removeIcon,
} from '../actions/IconActions';
import { update as updateForm } from '../actions/MessageFormActions';
import { create as createSnack } from '../actions/SnackActions';
import { MessageConfigDialog } from '../components/MessageConfigDialog';
import { bindActions } from './utility';

export const MessageConfigDialogContainer = connect(
    (state) => {
        const {
            messageForm,
            iconList,
            user,
        } = state;

        const dialog = getDialog(state, 'message-config');
        const open = !!dialog;
        const form = open &&
            messageForm.find(({id}) => id === dialog.data) || {};

        return {
            iconList,
            form,
            open,
            user,
        };
    },
    bindActions({
        createIcon,
        fetchIcon,
        removeIcon,
        updateForm,
        createSnack,
        close: () => close('message-config'),
    })
)(MessageConfigDialog);