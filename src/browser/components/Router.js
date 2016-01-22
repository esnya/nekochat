import React from 'react';
import { connect } from 'react-redux';
import * as Message from '../../actions/MessageActions'
import * as MessageForm from '../../actions/MessageFormActions'
import * as Room from '../../actions/RoomActions'
import * as Route from '../../actions/RouteActions'
import { Lobby } from './Lobby';
import { Chat } from './Chat';

const Handlers = {
    lobby: connect(state => ({
        ...state.roomList,
        user: state.user,
    }), dispatch => ({
        onJoin: id => dispatch(Route.set(`/${id}`)),
        leave: () => dispatch(Room.leave()),
        fetch: () => dispatch(Room.fetch()),
        createRoom: room => dispatch(Room.create(room)),
        removeRoom: id => dispatch(Room.remove(id)),
    }))(Lobby),
    chat: connect(state => ({
        ...(state.room),
        user: state.user,
        messageList: state.messageList,
        messageForm: state.messageForm,
    }), dispatch => ({
        join: id => dispatch(Room.join(id)),
        fetch: (minId = null) => dispatch(Message.fetch(minId)),
        onSubmitMessage: message => dispatch(Message.create(message)),
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