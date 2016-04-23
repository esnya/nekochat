import {knex} from '../knex';

export const NOT_FOUND = 'MODEL_NOT_FOUND';

export class Model {
    constructor(table, orderBy = 'created', order = 'DESC') {
        this.table = table;
        this.fn = knex.fn;
        this.orderBy = orderBy;
        this.order = order;

        knex.schema.hasTable(table)
            .then((exists) =>
                exists || knex.schema.createTable(
                    table,
                    (table) => this.create(table)
                )
            )
            .then(() => {});
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
        return knex(this.table)
            .insert({
                ...data,
                created: knex.fn.now(),
                modified: knex.fn.now(),
            })
            .then((ids) => data.id || ids[0])
            .then((id) => this.find('id', id));
    }

    // eslint-disable-next-line max-params
    update(id, user_id, data, force = false) {
        return knex(this.table)
            .where(force ? {id} : {id, user_id})
            .update(data)
            .then(() => this.find('id', id));
    }

    del(...finder) {
        return knex(this.table)
            .where(...finder)
            .update('deleted', knex.fn.now());
    }
}
