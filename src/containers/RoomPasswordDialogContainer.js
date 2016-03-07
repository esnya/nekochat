import { connect } from 'react-redux';
import { close, getDialog } from '../actions/DialogActions';
import { join } from '../actions/RoomActions';
import { set as setRoute } from '../actions/RouteActions';
import {
    RoomPasswordDialog as Component,
} from '../components/RoomPasswordDialog';

export const RoomPasswordDialog = connect(
    (state) => {
        const dialog = getDialog(state, 'room-password');

        return {
            open: !!dialog,
            room_id: dialog.data,
        };
    },
    (dispatch) => ({
        onJoin: (id, password) => {
            dispatch(close('room-password', true));
            dispatch(join(id, password));
        },
        onLeave: () => {
            dispatch(close('room-password', true));
            dispatch(setRoute('/'));
        },
    })
)(Component);
