import * as DIALOG from '../constants/DialogActions';

export const open = (id, data) => ({
    type: DIALOG.OPEN,
    id,
    data,
});
export const close = (id, all = false) => ({
    type: DIALOG.CLOSE,
    id,
    all,
});

export const getDialog = ({
    confirmList,
    dialog,
}, id) => {
    if (confirmList.length > 0) return false;
    else if (dialog.length === 0) return false;
    else if (dialog[0].id !== id) return false;

    return dialog[0];
};