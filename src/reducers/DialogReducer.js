import * as DIALOG from '../constants/DialogActions';

export const dialogReducer = (state = [], action) => {
    switch (action.type) {
        case DIALOG.OPEN:
            return [
                {
                    id: action.id,
                    data: action.data,
                },
                ...state,
            ];
        case DIALOG.CLOSE: {
            if (action.all) {
                return state.filter(({id}) => id !== action.id);
            }

            const toClose = state.find(({id}) => id === action.id);

            return state.filter((d) => d !== toClose);
        } default:
            return state;
    }
};