import { connect } from 'react-redux';
import { remove } from '../actions/room';
import RoomList from '../components/RoomList';

export default connect(
    ({ rooms, user }) => ({ rooms, user }),
    (dispatch) => ({
        onRemoveRoom: (e, room) => dispatch(remove(room.toJS())),
    })
)(RoomList);
