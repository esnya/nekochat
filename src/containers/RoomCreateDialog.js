import { connect } from 'react-redux';
import { create } from '../actions/room';
import RoomCreateDialog from '../components/RoomCreateDialog';

export default connect(
    ({ gameTypes }) => ({ gameTypes }),
    (dispatch) => ({
        onCreateRoom: (e, room) => dispatch(create(room)),
    })
)(RoomCreateDialog);
