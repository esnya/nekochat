import * as NOTIFICATION from '../constants/NotificationActions';

/**
 * Notifications reducer
 * @param{object} state - Atate
 * @param{object} action - Action
 * @returns{object} Next state
 */
export function notifications(state = [], action) {
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
}
