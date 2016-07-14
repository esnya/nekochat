import { map } from 'lodash';
import { connect } from 'react-redux';
import { getDialog, close } from '../actions/dialog';
import { create, remove, removeSelected } from '../actions/icon';
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
            const iconData = e.target;

            if (iconData.files.length === 0) return;

            map(iconData.files, (a) => a).forEach((file) => {
                dispatch(create({
                    name: file.name,
                    mime: file.type,
                    file,
                }));
            }, this);

            iconData.value = '';
        },
        onRemove: (icon) => dispatch(remove(icon)),
        onRemoveSelected: (e, icons) => dispatch(removeSelected(icons)),
    })
)(Component);
