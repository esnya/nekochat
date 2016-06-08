import {
    create,
    list,
    UPLOAD,
    FETCH,
    REMOVE,
    BULK_REMOVE,
} from '../../actions/icon';
import { genId } from '../../utility/id';
import { Icon } from '../models/icon';

export const icon = (client) => (next) => (action) => {
    const { type, payload } = action;

    switch (type) {
        case UPLOAD:
            Promise.all(
                payload.map(({ name, type, data }) => Icon
                    .insert({
                        id: genId(),
                        user_id: client.user.id || null,
                        name: name || null,
                        type: type || null,
                        data: data || null,
                    })
                    .then((icon) => client.emit(create(icon)))
                )
            )
            .catch((e) => client.logger.error(e));
            break;
        case FETCH:
            Icon
                .findAll('user_id', client.user.id)
                .then((icons) => client.emit(list(icons)))
                .catch((e) => client.logger.error(e));
            break;
        case REMOVE:
            Icon
                .del({
                    id: payload.id,
                    user_id: client.user.id,
                })
                .then(() => payload.id)
                .catch((e) => client.logger.error(e));
            break;
        case BULK_REMOVE:
            payload
                .icons
                .forEach(({id}) => {
                    Icon
                        .del({
                            id,
                            user_id: client.user.id,
                        })
                        .then(() => payload.id)
                        .catch((e) => client.logger.error(e));
                });
            break;
    }

    return next(action);
};
