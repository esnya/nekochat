import { connect } from 'react-redux';
import { open } from '../actions/DialogActions';
import {
    leave, fetch,
    create as createRoom,
    remove as removeRoom,
} from '../actions/RoomActions';
import { set as setRoute } from '../actions/RouteActions';
import { Lobby } from '../components/Lobby';
import { bindActions } from './utility';


export const LobbyContainer = connect(
    (state) => ({
        roomList: state.roomList,
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
)(Lobby);