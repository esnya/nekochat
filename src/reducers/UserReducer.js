import * as USER from '../constants/UserActions';

const User = JSON.parse(document.body.getAttribute('data-user'));

export const userReducer = function(state = User, action) {
    switch(action.type) {
        case USER.LOGGEDIN:
            return Object.assign({}, action.user);
        default:
            return state;
    }
};