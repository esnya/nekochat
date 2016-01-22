import { getCharacter } from '../character';

export const characterMiddleWare = ({dispatch}) => (next) => (action) => {
    if (Array.isArray(action.items) || action.data && action.data.character_url) {
        Promise.all(
            (Array.isArray(action.items) ? action.items : [action.data])
                .filter((item) => item && item.id != null && item.character_url && item.character_url !== item.character_data_url)
                .map((item) => getCharacter(item.character_url)
                    .then((data) => Promise.resolve({item, data}), () => Promise.resolve({item}))
                )
        ).then((results) => dispatch({
            type: `${action.type.match(/^(.*?)((_LIST)?_[A-Z]+)$/)[1]}_UPDATE`,
            data: results.map((result) => ({
                ...result.item,
                character_data: result.data,
                character_data_url: result.item.character_url,
            })),
        }));
    }

    return next(action);
};