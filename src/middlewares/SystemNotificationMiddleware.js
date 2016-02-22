import { template, transform } from 'lodash';
import { get as getCharacter } from '../actions/CharacterActions';
import { notify } from '../browser/notification';

export const systemNotificationMiddleware =
    ({dispatch, getState}) => (next) => (action) => {
        const {
            systemNotify,
            ...nextAction,
        } = action;

        if (systemNotify && !getState().dom.focused) {
            const character_url = systemNotify.character_url;
            const character_data = character_url &&
                getState().characters[character_url];
            const data = character_data && character_data.data;

            if (character_url && !data) {
                setTimeout(() => dispatch(getCharacter(character_url)));
            }

            const icon = data && new URL(
                data.icon || data.image || data.portrait,
                character_url
            );

            const msg = transform(
                action.systemNotify,
                (result, value, key) => {
                    result[key] = template(value)({
                        ...action,
                        icon,
                    });
                },
                {}
            );

            notify(msg).then((n) => {
                setTimeout(() => n.close(), 5000);
            });
        }

        return next(nextAction);
    };
