import { connect } from 'react-redux';
import { Notification } from '../components/Notification';
import { bindState, bindActions } from './utility';

export const NotificationContainer = connect(
    bindState('notifications')
)(Notification);