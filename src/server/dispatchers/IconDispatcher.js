import * as Icon from '../../actions/IconActions';
import * as ICON from '../../constants/IconActions';
import { generateId } from '../../utility/id';
import { knex, exists } from '../knex.js';
import { Dispatcher }  from './Dispatcher';

const IconFields = ['id', 'name', 'type', 'created', 'modified'];

export class IconDispatcher extends Dispatcher {
    onDispatch(action) {
        switch(action.type) {
            case ICON.CREATE: {
                const id = generateId([
                    this.user_id,
                    action.name,
                    action.mime,
                    action.data,
                ].join());

                return knex('icons').insert({
                        id,
                        user_id: this.user_id,
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
                    .then((icon) => this.dispatch(Icon.push([icon])))
                    .catch(() => Promise.reject('Failed to upload icon'));
            } case ICON.FETCH:
                return knex('icons')
                    .where('user_id', this.user_id)
                    .whereNull('deleted')
                    .orderBy('name')
                    .select(...IconFields)
                    .then((icons) => this.dispatch(Icon.push(icons)));
            case ICON.REMOVE:
                return knex('icons')
                    .where('id', action.id)
                    .where('user_id', this.user_id)
                    .delete('deleted')
                    .then(() => action.id)
                    .catch(() => Promise.reject('Failed to delete icon'));
        }
    }
}