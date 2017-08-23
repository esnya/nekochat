import config from 'config';
import createKnex from 'knex';

const knex = createKnex(config.get('database.default'));
export default knex;

export const now = config.get('database.default.client') === 'sqlite3'
    ? () => Date.now()
    : () => knex.fn.now();

export const exists = data => (
    !data
        ? Promise.reject(new Error('Not found'))
        : Promise.resolve(data)
);

export const inserted = ids => (
    ids.length === 0
        ? Promise.reject(new Error('Failed to insert'))
        : Promise.resolve(ids[0])
);

knex.migrate
    .latest()
    // .then(() => knex.seed.run())
    .then(() => {});
