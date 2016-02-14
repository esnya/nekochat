import * as CONFIRM from '../constants/ConfirmActions';

export const confirmListReducer = (state = [], action) => {
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
};