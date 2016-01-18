import Session from 'express-session';
import KnexSessionStore from 'connect-session-knex';
import Knex from 'knex';

let Store = KnexSessionStore(Session);
let knex = Knex(require('../config/database').session);

export const session = Session(Object.assign(require('../config/app').session, {
    store: new Store({
        knex: knex,
    }),
}));