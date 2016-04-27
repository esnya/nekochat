import {connect} from 'react-redux';
import {getDialog, close} from '../actions/DialogActions';
import {remove, removeSelected} from '../actions/IconActions';
import {
    IconEditDialog as Component,
} from '../components/icon-edit-dialog/icon-edit-dialog';

export const IconEditDialog = connect(
    (state) => ({
        iconList: state.iconList,
        open: Boolean(getDialog(state, 'icon-edit')),
    }),
    (dispatch) => ({
        onClose: () => dispatch(close('icon-edit')),
        onRemove: (icon) => dispatch(remove(icon)),
        onRemoveSelected: (e, icons) => dispatch(removeSelected(icons)),
    })
)(Component);
