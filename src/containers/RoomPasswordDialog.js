import { connect } from 'react-redux';
import { join } from '../actions/room';
import { set } from '../actions/route';
import RoomPasswordDialog from '../components/RoomPasswordDialog';

export default connect(
    (state, { dialog }) => ({
        room: dialog && dialog.get('room'),
    }),
    (dispatch) => ({
        onJoinRoom: (e, room) => dispatch(join(room)),
        onSetRoute: (e, path) => dispatch(set(path)),
    })
)(RoomPasswordDialog);
