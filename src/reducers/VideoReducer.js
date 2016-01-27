import * as VIDEO from '../constants/VideoActions';

export const videoReducer = (state = null, action) => {
    switch(action.type) {
        case VIDEO.CREATE:
            if (!action.stream) return state;
            return {
                id: action.id,
                stream: action.stream,
            };
        case VIDEO.END:
            return null;
        default:
            return state;
    }
};