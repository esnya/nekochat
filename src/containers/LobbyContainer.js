import { connect } from 'react-redux';
import {
    leave, fetch,
    create as createRoom,
    remove as removeRoom,
} from '../../actions/RoomActions';
import { set as setRoute } from '../../actions/RouteActions';
import { Lobby } from '../components/Lobby';
import { bindActions } from './utility';


export const LobbyContainer = connect(
    (state) => ({
        ...state.roomList,
        user: state.user,
    }),
    (dispatch) => ({
        ...bindActions({
            leave,
            fetch,
            createRoom,
            removeRoom,
        })(dispatch),
        onJoin: (id) => dispatch(setRoute(`/${id}`)),
    })
)(Lobby);