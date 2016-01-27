import { connect } from 'react-redux';
import { join } from '../actions/RoomActions';
import { set as setRoute } from '../actions/RouteActions';
import {
    create as createVideo,
    end as endVideo,
} from '../actions/VideoActions';
import { fetch } from '../actions/MessageActions';
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
        video: state.video,
        videoList: state.videoList,
    }), bindActions({
        join,
        setRoute,
        fetch,
        createVideo,
        endVideo,
    })
)(Chat);
