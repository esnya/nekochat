import {push} from '../../actions/IconActions';
import * as ICON from '../../constants/IconActions';
import {generateId} from '../../utility/id';
import {Icon} from '../models/icon';

const IconFields = ['id', 'name', 'type', 'created', 'modified'];

export const icon = (client) => (next) => (action) => {
    switch (action.type) {
        case ICON.CREATE: {
            const id = generateId([
                client.user.id,
                action.name,
                action.mime,
                action.data,
            ].join());

            Icon
                .insert({
                    id,
                    user_id: client.user.id || null,
                    name: action.name || null,
                    type: action.mime || null,
                    data: action.file || null,
                })
                .then((icon) => client.emit(push([icon])))
                .catch((e) => client.logger.error(e));
            break;
        }
        case ICON.FETCH:
            Icon
                .findAll('user_id', client.user.id)
                .then((icons) => client.emit(push(icons)))
                .catch((e) => client.logger.error(e));
            break;
        case ICON.REMOVE:
            Icon
                .del({
                    id: action.id,
                    user_id: client.user.id,
                })
                .then(() => action.id)
                .catch((e) => client.logger.error(e));
            break;
    }

    return next(action);
};
