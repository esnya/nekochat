import { getCharacter } from '../browser/character';
import { get } from '../browser/xhr';
import * as Character from '../actions/CharacterActions';
import * as CHARACTER from '../constants/CharacterActions';

export const characterMiddleWare = ({getState, dispatch}) =>
    (next) => (action) => {
        if (action.type === CHARACTER.GET) {
            console.log(action);
            console.log(getState());
            console.log(getState().characters);
            const cached = getState().characters[action.url];

            if (!cached && cached.timestamp < Date.now() - 60 * 1000) {
                const url = action.url;

                dispatch(Character.set(url, null));
                get(action.url)
                    .then((data) => Character.set(url, data));
            }
        }

        if (Array.isArray(action.items) ||
            action.data && action.data.character_url) {
            Promise.all(
                (Array.isArray(action.items) ? action.items : [action.data])
                    .filter((item) => item &&
                        item.id != null &&
                        item.character_url &&
                        item.character_url !== item.character_data_url
                    )
                    .map((item) => getCharacter(item.character_url)
                        .then(
                            (data) => Promise.resolve({item, data}),
                            () => Promise.resolve({item: {
                                ...item,
                                character_url: null,
                            }})
                        )
                    )
            ).then((results) => dispatch({
                type:
                    `${action.type.match(/^(.*?)((_LIST)?_[A-Z]+)$/)[1]}_UPDATE`,
                data: results.map((result) => ({
                    ...result.item,
                    character_data: result.data,
                    character_data_url: result.item.character_url,
                })),
            }));
        }

        return next(action);
    };