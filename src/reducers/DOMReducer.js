import * as DOM from '../constants/DOMActions';

/**
 * DOM reducer
 * @param{object} state - Atate
 * @param{object} action - Action
 * @returns{object} Next state
 */
export function dom(state = { focused: true }, action) {
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
}