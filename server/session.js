'use strict';

const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

let knex = require('knex')({
    client: 'mysql',
    connection: {
        host: process.env.MYSQL_PORT_3306_TCP_ADDR,
        user: 'root',
        password: process.env.MYSQL_ROOT_PASSWORD,
        database: 'www_users'
    },
});

module.exports = session({
    cookie: {
        domain: process.env.SERVER_NAME,
    },
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    store: new KnexSessionStore({
        knex: knex,
    }),
});
