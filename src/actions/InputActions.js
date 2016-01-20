import * as INPUT from '../constants/InputActions';

export const begin = function(input) {
    return {
        type: INPUT.BEGIN,
        server: true,
        ...input,
    };
};
export const began = function(input) {
    return {
        type: INPUT.BEGAN,
        ...input,
    };
};

export const end = function(input) {
    return {
        type: INPUT.END,
        server: true,
        ...input,
    };
};
export const ended = function(input) {
    return {
        type: INPUT.ENDED,
        ...input,
    };
};