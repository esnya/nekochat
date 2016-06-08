import { connect } from 'react-redux';
import { open } from '../actions/dialog';
import RoomCreateButton from '../components/RoomCreateButton';

export default connect(
    () => ({}),
    (dispatch) => ({
        onCreateRoom: () => dispatch(open('room-create')),
    })
)(RoomCreateButton);
