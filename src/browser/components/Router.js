import React from 'react';
import { connect } from 'react-redux';
import * as Message from '../../actions/MessageActions'
import * as MessageForm from '../../actions/MessageFormActions'
import * as Room from '../../actions/RoomActions'
import * as Route from '../../actions/RouteActions'
import { Lobby } from './Lobby';
import { Chat } from './Chat';

const Handlers = {
    lobby: connect((state) => ({
        ...state.roomList,
        user: state.user,
    }), (dispatch) => ({
        onJoin: (id) => dispatch(Route.set(`/${id}`)),
        leave: () => dispatch(Room.leave()),
        fetch: () => dispatch(Room.fetch()),
        createRoom: (room) => dispatch(Room.create(room)),
        removeRoom: (id) => dispatch(Room.remove(id)),
    }))(Lobby),
    chat: connect((state) => ({
        ...(state.room),
        input: state.input,
        messageList: state.messageList,
        messageForm: state.messageForm,
        user: state.user,
    }), (dispatch) => ({
        join: (id) => dispatch(Room.join(id)),
        setRoute: (route) => dispatch(Route.set(route)),
        fetch: (minId = null) => dispatch(Message.fetch(minId)),
        onSubmitMessage: (message) => dispatch(Message.create(message)),
        createForm: () => dispatch(MessageForm.create()),
    }))(Chat),
};

export const Router = (props) => {
    let {
        route,
        params,
    } = props;
    let Handler = Handlers[route] || 'div';

    return <Handler {...params} />;
};