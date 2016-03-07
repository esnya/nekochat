import * as USER from '../constants/UserActions';

export const loggedin = function(user) {
    return {
        type: USER.LOGGEDIN,
        user,
    };
};
