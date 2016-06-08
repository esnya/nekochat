import { connect } from 'react-redux';
import { update } from '../actions/room';
import RoomEditDialog from '../components/RoomEditDialog';

export default connect(
    ({ room }) => ({
        room,
    }),
    (dispatch) => ({
        onUpdateRoom: (e, room) => dispatch(update(room)),
    })
)(RoomEditDialog);
