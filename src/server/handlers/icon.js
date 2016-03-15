import * as Icon from '../../actions/IconActions';
import * as ICON from '../../constants/IconActions';
import { generateId } from '../../utility/id';
import { knex, exists } from '../knex.js';

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

            knex('icons')
                .insert({
                    id,
                    user_id: client.user.id || null,
                    name: action.name || null,
                    type: action.mime || null,
                    data: action.file || null,
                    created: knex.fn.now(),
                    modified: knex.fn.now(),
                }, 'id')
                .then(() =>
                    knex('icons')
                        .where('id', id)
                        .whereNull('deleted')
                        .first(...IconFields)
                )
                .then(exists)
                .then((icon) => client.emit(Icon.push([icon])));
            break;
        }
        case ICON.FETCH:
            knex('icons')
                .where('user_id', client.user.id)
                .whereNull('deleted')
                .orderBy('name')
                .select(...IconFields)
                .then((icons) => client.emit(Icon.push(icons)));
            break;
        case ICON.REMOVE:
            knex('icons')
                .where('id', action.id)
                .where('user_id', client.user.id)
                .delete('deleted')
                .then(() => action.id);
            break;
    }

    return next(action);
};
