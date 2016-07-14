import moment from 'moment';
import knex from '../knex';

export const NOT_FOUND = 'MODEL_NOT_FOUND';

export class Model {
    constructor(table, orderBy = 'created', order = 'DESC') {
        this.table = table;
        this.orderBy = orderBy;
        this.order = order;
    }

    get query() {
        return knex(this.table);
    }

    findAll(...finder) {
        const query = knex(this.table)
            .whereNull('deleted')
            .orderBy(this.orderBy, this.order);

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
        const now = moment().format();

        return knex(this.table)
            .insert({
                ...data,
                created: now,
                modified: now,
            })
            .then((ids) => data.id || ids[0])
            .then((id) => this.find('id', id));
    }

    // eslint-disable-next-line max-params, camelcase
    update(id, user_id, data, force = false) {
        const now = moment().format();

        return knex(this.table)
            .where(force ? { id } : { id, user_id })
            .update({
                ...data,
                modified: now,
            })
            .then(() => this.find('id', id));
    }

    del(...finder) {
        return knex(this.table)
            .where(...finder)
            .update('deleted', moment().format());
    }
}
