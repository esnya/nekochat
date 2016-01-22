import * as MessageForm from '../../actions/MessageFormActions';
import * as MESSAGE_FORM from '../../constants/MessageFormActions';
import * as ROOM from '../../constants/RoomActions';
import * as USER from '../../constants/UserActions';

let id = 0;

let user, room;
const getKey = () => `/beniimo-online/${user.id}/${room.id}/form`;
const load = (state) => {
    if (!user || !room) return state;

    let form = localStorage.getItem(getKey());
    if (form) return JSON.parse(form);
    
    if (state.length > 0) return save(state);

    return save([{
        is_first: true,
        id: id++,
        name: user.name,
        character_url: null,
        icon_id: null,
    }]);
};
const save = (state) => {
    localStorage.setItem(getKey(), JSON.stringify(state));
    return state;
};

export const messageFormReducer = function(state = [], action) {
    switch (action.type) {
        case USER.LOGGEDIN:
            user = action.user;
            return state;
        case ROOM.JOIN:
            room = null;
            return [];
        case ROOM.JOINED:
            room = action.room;
            return load(state);
        case MESSAGE_FORM.CREATE:
            let form = action.copy ? state[0] : action;
            return save([
                {
                    id: id++,
                    name: form.name,
                    character_url: form.character_url,
                    icon_id: form.icon_id,
                },
                ...state,
            ]);
        case MESSAGE_FORM.UPDATE:
            return save(state.map((form, i) => form.id == action.id ? {
                is_first: i == (state.length - 1),
                id: action.id,
                name: action.name,
                character_url: action.character_url,
                icon_id: action.icon_id,
            } : form));
        case MESSAGE_FORM.REMOVE:
            return save(state.filter(form => form.id != action.id));
        default:
            return state;
    };
};