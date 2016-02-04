import { connect } from 'react-redux';
import { join } from '../actions/RoomActions';
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
    }), bindActions({
        join,
        setRoute,
    })
)(Chat);