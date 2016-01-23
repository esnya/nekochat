import * as INPUT from '../constants/InputActions';

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

export const begin = function(input) {
    return {
        type: INPUT.BEGIN,
        server: true,
        ...input,
    };
};
export const began = (input) => ({
    ...input,
    type: INPUT.BEGAN,
    timeout: {
        timeout: 10 * 1000,
        next: ended(input),
    },
});
