import * as Notification from '../actions/NotificationActions';
import * as NOTIFICATION from '../constants/NotificationActions';

export const notificationMiddleware = ({dispatch}) => (next) => (action) => {
    const {
        notify,
        ...nextAction,
    } = action;

    if (action.type === NOTIFICATION.NOTIFY) {
        const {
            id,
            duration,
        } = action.notification;

        setTimeout(
            () => dispatch(Notification.close(id)),
            duration || 3000
        );
    } else if (notify) {
        setTimeout(() => dispatch(Notification.notify(notify, nextAction)));
    }

    return next(nextAction);
};
