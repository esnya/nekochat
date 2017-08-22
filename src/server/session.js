import config from 'config';
import connectRedis, { MemoryStore } from 'connect-redis';
import Session from 'express-session';
import knexSessionStore from 'connect-session-knex';
import Knex from 'knex';
import redisClient from './redisClient';

const getStore = (type) => {
    switch (type) {
    case 'database': {
        const Store = knexSessionStore(Session);
        const knex = new Knex(config.get('database.session'));

        return new Store({ knex });
    }
    case 'redis': {
        if (!redisClient) return getStore('memory');

        const RedisStore = connectRedis(Session);
        return new RedisStore({ client: redisClient });
    }
    default:
        return new MemoryStore();
    }
};

export const session = new Session({
    ...config.get('session'),
    secret: config.get('app.secret'),
    store: getStore(config.get('session.store')),
});
