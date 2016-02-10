import { pick } from 'lodash';
import * as CHARACTER from '../constants/CharacterActions';

export const characterReducer = (state = {}, action) => {
    switch(action.type) {
        case CHARACTER.SET:
            return {
                ...state,
                [action.url]: pick(action, ['data', 'timestamp']),
            };
        default:
            return state;
    }
};