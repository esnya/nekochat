import { getCharacter } from '../browser/character';
import { get } from '../browser/xhr';
import * as Character from '../actions/CharacterActions';
import * as CHARACTER from '../constants/CharacterActions';

const loading = {};

export const characterMiddleWare = ({getState, dispatch}) =>
    (next) => (action) => {
        if (action.type === CHARACTER.GET) {
            const url = action.url;
            const character_data = getState().characters[url];

            if (!loading[url] && (
                !character_data ||
                    character_data.timestamp + 10 * 60 * 1000 < Date.now()
            )) {
                loading[url] = true;
                get(url)
                    .then((data) => dispatch(Character.set(url, data)))
                    .catch(() => null)
                    .then(() => (loading[url] = false));
            }
        }

        return next(action);
    };