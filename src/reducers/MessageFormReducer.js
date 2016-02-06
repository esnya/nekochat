import * as MESSAGE_FORM from '../constants/MessageFormActions';
import * as ROOM from '../constants/RoomActions';
import * as USER from '../constants/UserActions';

let id = 0;

let user = null;
let room = null;

const getKey = () => `/nekochat/${user.id}/${room.id}/form`;
const save = (state) => {
    localStorage.setItem(getKey(), JSON.stringify(state));
    return state;
};
const load = (state) => {
    if (!user || !room) return state;

    const form = localStorage.getItem(getKey());

    if (form) {
        const parsed = JSON.parse(form);

        parsed.forEach((f) => id = Math.max(f.id + 1, id));
        return parsed;
    }

    if (state.length > 0) return save(state);

    return save([{
        is_first: true,
        id: id++,
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
                    id: id++,
                    name: form.name,
                    character_url: form.character_url,
                    icon_id: form.icon_id,
                },
                ...state,
            ]);
        } case MESSAGE_FORM.UPDATE: {
            const items = Array.isArray(action.data)
                ? action.data : [action.data];

            return save(
                state.map((item) => ({
                        item, update: items.find((b) => item.id === b.id),
                    }))
                    .map(({item, update}, i) => update ? Object.assign(
                            {},
                            item,
                            update,
                            {is_first: i === state.length - 1}
                        ) : item
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