import { connect } from 'react-redux';
import { getDialog, close } from '../actions/DialogActions';
import { update as onUpdate } from '../actions/RoomActions';
import { RoomUpdateDialog } from '../components/RoomUpdateDialog';
import { bindActions } from './utility';

export const RoomUpdateDialoggContainer = connect(
    (state) => ({
        open: Boolean(getDialog(state, 'room-update')),
        room: state.room,
    }),
    bindActions({
        onUpdate,
        onClose: () => close('room-update'),
    })
)(RoomUpdateDialog);
