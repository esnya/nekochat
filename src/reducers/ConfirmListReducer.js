import * as CONFIRM from '../constants/ConfirmActions';

/**
 * Confirm list reducer
 * @param{object} state - Atate
 * @param{object} action - Action
 * @returns{object} Next state
 */
export function confirmList(state = [], action) {
    switch (action.type) {
        case CONFIRM.CREATE:
            return [
                ...state,
                {...action.confirm},
            ];
        case CONFIRM.OK:
        case CONFIRM.CANCEL:
            return state.filter((c) => c.id !== action.id);
        default:
            return state;
    }
}
