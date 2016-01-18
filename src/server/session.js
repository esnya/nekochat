'use strict';

const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

let knex = require('knex')(require('../../config/database').session);

module.exports = session(Object.assign({
    cookie: {
        domain: process.env.SERVER_NAME,
    },
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    store: new KnexSessionStore({
        knex: knex,
    }),
}, require('../../config/app').session));
