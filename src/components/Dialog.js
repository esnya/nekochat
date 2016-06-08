import IPropTypes from 'react-immutable-proptypes';
import React, { PropTypes } from 'react';
import { pureRender } from '../utility/enhancer';
import MemoEditDialog from '../containers/MemoEditDialog';
import NameEditDialog from '../containers/NameEditDialog';
import RoomCreateDialog from '../containers/RoomCreateDialog';
import RoomEditDialog from '../containers/RoomEditDialog';
import RoomPasswordDialog from '../containers/RoomPasswordDialog';
import Confirm from './Confirm';

const table = {
    confirm: Confirm,
    'memo-edit': MemoEditDialog,
    'name-edit': NameEditDialog,
    'room-create': RoomCreateDialog,
    'room-edit': RoomEditDialog,
    'room-password': RoomPasswordDialog,
};

const Dialog = (props) => {
    const {
        dialogs,
        onClose,
        onOK,
        ...others,
    } = props;

    const dialog = dialogs.first();
    const type = dialog && dialog.get('type');

    const elements = Object.keys(table)
        .map((key) => {
            const Component = table[key];
            const open = Boolean(dialog) && type === key;

            return (
                <Component
                    {...others}
                    dialog={open ? dialog : null}
                    key={key}
                    open={open}
                    onClose={(e) => dialog && onClose(e, dialog.get('id'))}
                    onOK={(e) => dialog && onOK(e, dialog.get('id'))}
                />
            );
        });

    return <div>{elements}</div>;
};
Dialog.propTypes = {
    dialogs: IPropTypes.listOf(IPropTypes.contains({
        id: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
    })).isRequired,
    onClose: PropTypes.func.isRequired,
    onOK: PropTypes.func.isRequired,
};
export default pureRender(Dialog);
