import * as MessageForm from '../../actions/MessageFormActions';
import * as MESSAGE_FORM from '../../constants/MessageFormActions';

let id = 0;

export const messageFormReducer = function(state = [], action) {
    console.log('MessageForm', state, action);
    switch (action.type) {
        case MESSAGE_FORM.CREATE:
            let form = action.copy ? state[0] : action;
            return [
                {
                    id: id++,
                    name: form.name,
                    character_url: form.character_url,
                    icon_id: form.icon_id,
                },
                ...state,
            ];
        case MESSAGE_FORM.UPDATE:
            return state.map(form => form.id == action.id ? {
                id: action.id,
                name: action.name,
                character_url: action.character_url,
                icon_id: action.icon_id,
            } : form);
        case MESSAGE_FORM.REMOVE:
            return state.filter(form => form.id != action.id);
        default:
            return state;
    };
};