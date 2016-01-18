const sqlite3 = {
    client: 'sqlite3',
    connection: {
        filename: 'tmp/db.sqlite',
    },
};

module.exports = Object.assign({
    default: sqlite3,
    session: sqlite3,
}, require('../../config/database'));