import * as MESSAGE_FORM from '../constants/MessageFormActions';

export const create = function(form) {
    return {
        type: MESSAGE_FORM.CREATE,
        copy: !form,
        ...form,
    };
};

export const update = function(data) {
    return {
        type: MESSAGE_FORM.UPDATE,
        data,
    };
};

export const remove = function(id) {
    return {
        type: MESSAGE_FORM.REMOVE,
        id,
    };
};

export const whisperTo = function(whisper_to) {
    return {
        type: MESSAGE_FORM.WHISPER_TO,
        whisper_to,
    };
};
