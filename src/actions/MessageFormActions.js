import * as MESSAGE_FORM from '../constants/MessageFormActions';

export const create = function(form) {
    return {
        type: MESSAGE_FORM.CREATE,
        copy: !form,
        ...form,
    };
};

export const update = function(form) {
    return {
        type: MESSAGE_FORM.UPDATE,
        ...form,
    };
};

export const remove = function(id) {
    return {
        type: MESSAGE_FORM.REMOVE,
        id,
    };
};