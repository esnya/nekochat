import { connect } from 'react-redux';
import { create } from '../actions/room';
import RoomCreateDialog from '../components/RoomCreateDialog';

export default connect(
    () => ({}),
    (dispatch) => ({
        onCreateRoom: (e, room) => dispatch(create(room)),
    })
)(RoomCreateDialog);
