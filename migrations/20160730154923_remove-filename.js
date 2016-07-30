'use strict';

exports.up = (knex) =>
    knex.schema.table('files', table => {
        table.dropColumn('name');
    });

exports.down = (knex) =>
    knex.schema.table('files', table => {
        table.string('name')
            .after('user_id');
    });
