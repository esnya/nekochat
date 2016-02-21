import * as INPUT from '../constants/InputActions';

export const inputReducer = function(state = [], action) {
    switch (action.type) {
        case INPUT.BEGAN:
            return [{
                id: action.id,
                user_id: action.user_id,
                name: action.name,
                message: action.message,
            }, ...(state.filter((i) => i.id !== action.id))];
        case INPUT.ENDED:
            return state.filter((i) => i.id !== action.id);
        default:
            return state;
    }
};