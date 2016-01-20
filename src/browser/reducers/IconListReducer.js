import * as ICON from '../../constants/IconActions';

export const iconListReducer = function(state = [], action) {
    switch(action.type) {
        case ICON.PUSH:
            return [...action.icons, ...(state.filter(a => !action.icons.find(b => a.id == b.id)))];
        default:
            return state;
    }
};