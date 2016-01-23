import { connect } from 'react-redux';
import { join } from '../../actions/RoomActions';
import { set as setRoute } from '../../actions/RouteActions';
import { fetch } from '../../actions/MessageActions';
import { Chat } from '../components/Chat';
import { bindActions } from './utility';

export const ChatContainer = connect(
    (state) => ({
        ...(state.room),
        input: state.input,
        messageList: state.messageList,
        messageForm: state.messageForm,
        user: state.user,
    }), bindActions({
        join,
        setRoute,
        fetch,
    })
)(Chat);