import config from 'config';
import Knex from 'knex';

export const knex = Knex(config.get('database.default'));

export const now = config.get('database.default.client') === 'sqlite3'
    ? () => Date.now()
    : () => knex.fn.now();

export const exists = function(data) {
    return !data
        ? Promise.reject(new Error('Not found'))
        : Promise.resolve(data);
};

export const inserted = function(ids) {
    return ids.length === 0
        ? Promise.reject(new Error('Failed to insert'))
        : Promise.resolve(ids[0]);
};

knex.migrate
    .latest()
    // .then(() => knex.seed.run())
    .then(() => {});
