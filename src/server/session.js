import config from 'config';
import Session from 'express-session';
import KnexSessionStore from 'connect-session-knex';
import Knex from 'knex';

const Store = KnexSessionStore(Session);
const knex = Knex(config.get('database.session'));

export const session = Session({
    ...config.get('app.session'),
    secret: config.get('app.secret'),
    store: new Store({knex}),
});