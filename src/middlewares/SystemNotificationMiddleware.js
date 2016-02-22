import { template, transform } from 'lodash';
import { getCharacter } from '../browser/character';
import { notify } from '../browser/notification';

export const systemNotificationMiddleware =
    ({getState}) => (next) => (action) => {
        if (action.systemNotify && !getState().dom.focused) {
            const item = action.items[0];

            (
                item && item.character_url
                    ? getCharacter(item.character_url)
                        .then(
                            (data) => new URL(
                                data.icon || data.portrait || data.image,
                                item.character_url
                            )
                            .toString()
                        )
                    : Promise.resolve()
            )
            .then((icon) => {
                const msg = transform(
                    action.systemNotify,
                    (result, value, key) => {
                        result[key] = template(value)(action);
                    },
                {}
                );

                notify({
                    ...msg,
                    icon: icon || msg.icon,
                }).then((n) => {
                    setTimeout(() => n.close(), 5000);
                });
            });
        }

        return next(action);
    };