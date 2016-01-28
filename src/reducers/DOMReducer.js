import * as DOM from '../constants/DOMActions';

export const domReducer = (state = {}, action) => {
    switch (action.type) {
        case DOM.LOAD:
            return {
                ...state,
                loaded: true,
            };
        case DOM.FOCUS:
            return {
                ...state,
                focused: true,
            };
        case DOM.BLUR:
            return {
                ...state,
                focused: false,
            };
        default:
            return state;
    }
};