import * as MESSAGE from '../constants/MessageActions';

export const create = function(data) {
    return {
        type: MESSAGE.CREATE,
        server: true,
        data,
    };
};

export const update = function(data) {
    return {
        type: MESSAGE.UPDATE,
        data,
    };
};