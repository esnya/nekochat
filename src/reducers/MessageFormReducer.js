import * as MESSAGE_FORM from '../constants/MessageFormActions';
import * as ROOM from '../constants/RoomActions';
import * as USER from '../constants/UserActions';
import { generateId } from '../utility/id';

let user = null;
let room = null;

const getKey = () => `/nekochat/${user.id}/${room.id}/form`;
const save = (state) => {
    localStorage.setItem(getKey(), JSON.stringify(state.map(
       (form) => ({
           ...form,
           whisper_to: null,
       })
    )));
    return state;
};
const load = (state) => {
    if (!user || !room) return state;

    const form = localStorage.getItem(getKey());

    if (form) {
        const parsed = JSON.parse(form);
        return parsed;
    }

    if (state.length > 0) return save(state);

    return save([{
        is_first: true,
        id: generateId(),
        name: user.name,
        character_url: null,
        icon_id: null,
    }]);
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
        case MESSAGE_FORM.CREATE: {
            const form = action.copy ? state[0] : action;

            return save([
                {
                    id: generateId(),
                    name: form.name,
                    character_url: form.character_url,
                    icon_id: form.icon_id,
                },
                ...state,
            ]);
        } case MESSAGE_FORM.UPDATE: {
            return save(
                state.map((form) => form.id === action.data.id
                    ? {
                        ...form,
                        ...action.data,
                    } : form
                )
            );
        } case MESSAGE_FORM.REMOVE:
            return save(state.filter((form) => form.id !== action.id));
        case MESSAGE_FORM.WHISPER_TO:
            return save([
                ...state.slice(0, state.length - 1),
                {
                    ...state[state.length - 1],
                    whisper_to: action.whisper_to,
                },
            ]);
        default:
            return state;
    }
};