import * as ICON from '../constants/IconActions';

export const iconListReducer = function(state = [], action) {
    switch (action.type) {
        case ICON.PUSH:
            return [
                ...action.icons,
                ...state.filter(
                    (a) => !action.icons.find((b) => a.id === b.id)
                ),
            ];
        case ICON.REMOVE:
            return state.filter((icon) => icon.id !== action.id);
        case ICON.REMOVE_SELECTED:
            return state.filter((
                {id}) => !action.icons.find((i) => i.id === id)
            );
        default:
            return state;
    }
};
