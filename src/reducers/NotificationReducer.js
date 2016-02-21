import * as NOTIFICATION from '../constants/NotificationActions';

export const notificationReducer = (state = [], action) => {
    switch (action.type) {
        case NOTIFICATION.NOTIFY:
            return [
                action.notification,
                ...state,
            ];
        case NOTIFICATION.CLOSE:
            return state.filter(({id}) => id !== action.id);
        default:
            return state;
    }
};