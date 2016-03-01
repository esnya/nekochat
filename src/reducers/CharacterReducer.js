import { pick } from 'lodash';
import * as CHARACTER from '../constants/CharacterActions';

/**
 * Characters reducer
 * @param{object} state - Atate
 * @param{object} action - Action
 * @returns{object} Next state
 */
export function characters(state = {}, action) {
    switch (action.type) {
        case CHARACTER.SET:
            return {
                ...state,
                [action.url]: pick(action, ['data', 'timestamp']),
            };
        default:
            return state;
    }
}
