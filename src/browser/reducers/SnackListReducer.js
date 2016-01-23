import * as SNACK from '../../constants/SnackActions';

export const snackListReducer = (state = [], action) => {
    switch(action.type) {
        case SNACK.CREATE:
            return [
                ...state,
                {...action.snack},
            ];
        case SNACK.REMOVE:
            return state.filter((s) => s.id !== action.id);
        default:
            return state;
    }
};