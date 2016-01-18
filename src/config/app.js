const app = require('../../config/app');

module.exports = {
    session: Object.assign({
        cookie: Object.assign({
            domain: process.env.SERVER_NAME,
        }, app.session && app.session.cookie),
        resave: true,
        saveUninitialized: true,
        secret: process.env.SESSION_SECRET,
    }, app.session),
};