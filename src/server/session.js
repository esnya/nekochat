import config from 'config';
import connectRedis from 'connect-redis';
import Session from 'express-session';
import knexSessionStore from 'connect-session-knex';
import Knex from 'knex';

const getStore = (type) => {
    switch (type) {
    case 'database': {
        const Store = knexSessionStore(Session);
        const knex = new Knex(config.get('database.session'));

        return new Store({ knex });
    }
    case 'redis': {
        const RedisStore = connectRedis(Session);

        return new RedisStore(config.get('redis'));
    }
    default:
        throw new Error(`Unsupported store type: ${type}`);
    }
};

export const session = new Session({
    ...config.get('session'),
    secret: config.get('app.secret'),
    store: getStore(config.get('session.store')),
});
