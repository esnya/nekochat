import { connect } from 'react-redux';
import { open } from '../actions/dialog';
import RoomEditButton from '../components/RoomEditButton';

export default connect(
    () => ({}),
    (dispatch) => ({
        onEditRoom: () => dispatch(open('room-edit')),
    })
)(RoomEditButton);
