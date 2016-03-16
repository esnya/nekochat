import { connect } from 'react-redux';
import { open } from '../actions/DialogActions';
import { join, fetchUser } from '../actions/RoomActions';
import { set as setRoute } from '../actions/RouteActions';
import { Chat } from '../components/Chat';
import { bindActions } from './utility';

export const ChatContainer = connect(
    (state) => ({
        ...(state.room),
        dom: state.dom,
        input: state.input,
        messageList: state.messageList,
        messageForm: state.messageForm,
        user: state.user,
        users: state.users,
    }), bindActions({
        join,
        setRoute,
        onRoomEdit: () => open('room-update'),
        onFetchUser: fetchUser,
    })
)(Chat);
