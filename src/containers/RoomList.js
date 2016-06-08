import { connect } from 'react-redux';
import { remove } from '../actions/room';
import { set } from '../actions/route';
import RoomList from '../components/RoomList';

export default connect(
    ({ rooms, user }) => ({ rooms, user }),
    (dispatch) => ({
        onRemoveRoom: (e, room) => dispatch(remove(room.toJS())),
        onRoute: (e, path) => dispatch(set(path, e)),
    })
)(RoomList);
