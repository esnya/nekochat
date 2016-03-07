import { connect } from 'react-redux';
import { open } from '../actions/DialogActions';
import {
    leave, fetch,
    create as createRoom,
    remove as removeRoom,
} from '../actions/RoomActions';
import { set as setRoute } from '../actions/RouteActions';
import { RoomList } from '../components/RoomList';
import { bindActions } from './utility';


export const RoomListContainer = connect(
    (state) => ({
        rooms: state.roomList,
        user: state.user,
    }),
    (dispatch) => ({
        ...bindActions({
            open,
            leave,
            fetch,
            createRoom,
            removeRoom,
            setRoute,
        })(dispatch),
        onJoin: (id) => dispatch(setRoute(`/${id}`)),
    })
)(RoomList);
