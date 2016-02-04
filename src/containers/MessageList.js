import { fetch } from '../actions/MessageActions';
import { connect } from 'react-redux';
import { MessageList as Component } from '../components/MessageList';
import { bindState, bindActions } from './utility';

export const MessageList = connect(
    bindState('...room', 'messageList', 'input'),
    bindActions({
        fetch,
    })
)(Component);