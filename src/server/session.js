import config from 'config';
import ConnectRedis from 'connect-redis';
import Session from 'express-session';
import KnexSessionStore from 'connect-session-knex';
import Knex from 'knex';

const getStore = (type) => {
    switch (type) {
        case 'database': {
            const Store = KnexSessionStore(Session);
            const knex = Knex(config.get('database.session'));
            return new Store({knex});
        }
        case 'redis': {
            const RedisStore = ConnectRedis(Session);
            return new RedisStore(config.get('redis'));
        }
        default:
            throw new Error(`Unsupported store type: ${type}`);
    }
};

export const session = Session({
    ...config.get('session'),
    secret: config.get('app.secret'),
    store: getStore(config.get('session.store')),
});