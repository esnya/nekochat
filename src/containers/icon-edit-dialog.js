import {map} from 'lodash';
import {connect} from 'react-redux';
import {getDialog, close} from '../actions/dialog';
import {create, remove, removeSelected} from '../actions/icon';
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
        onUploadIcon: (e) => {
            const icon_data = e.target;

            if (icon_data.files.length === 0) return;

            map(icon_data.files, (a) => a).forEach((file) => {
                dispatch(create({
                    name: file.name,
                    mime: file.type,
                    file,
                }));
            }, this);

            icon_data.value = '';
        },
        onRemove: (icon) => dispatch(remove(icon)),
        onRemoveSelected: (e, icons) => dispatch(removeSelected(icons)),
    })
)(Component);
