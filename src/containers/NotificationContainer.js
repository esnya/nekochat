import { connect } from 'react-redux';
import { Notification } from '../components/Notification';
import { bindState } from './utility';

export const NotificationContainer = connect(
    bindState('notifications')
)(Notification);
