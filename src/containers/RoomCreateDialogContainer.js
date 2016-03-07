import { connect } from 'react-redux';
import { getDialog, close } from '../actions/DialogActions';
import { create } from '../actions/RoomActions';
import { RoomCreateDialog } from '../components/RoomCreateDialog';
import { bindActions } from './utility';

export const RoomCreateDialoggContainer = connect(
    (state) => ({
        open: !!getDialog(state, 'room-create'),
    }),
    bindActions({
        create,
        close: () => close('room-create'),
    })
)(RoomCreateDialog);
