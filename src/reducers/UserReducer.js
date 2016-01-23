import * as USER from '../../constants/UserActions';

export const userReducer = function(state = null, action) {
    switch(action.type) {
        case USER.LOGGEDIN:
            return Object.assign({}, action.user);
        default:
            return state;
    }
};