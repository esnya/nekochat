import { knex } from '../knex';

export const NOT_FOUND = 'MODEL_NOT_FOUND';

export class Model {
    constructor(table) {
        this.table = table;
    }

    findAll(...finder) {
        const query = knex(this.table)
            .whereNull('deleted')
            .orderBy('created', 'DESC');

        if (finder.length === 0) return query;
        return query.where(...finder);
    }

    find(...finder) {
        return knex(this.table)
            .whereNull('deleted')
            .where(...finder)
            .first()
            .then((item) => item || Promise.reject(NOT_FOUND));
    }

    insert(data) {
        return knex(this.table)
            .insert({
                ...data,
                created: knex.fn.now(),
                modified: knex.fn.now(),
            })
            .then((ids) => data.id || ids[0])
            .then((id) => this.find('id', id));
    }

    del(...finder) {
        return knex(this.table)
            .where(...finder)
            .update('deleted', knex.fn.now());
    }
}
