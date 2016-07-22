'use strict';

exports.up = (knex) => knex.schema.table('messages', (table) => {
    table.string('file_type').after('file_id');
});

exports.down = (knex) => knex.schema.table('messages', (table) => {
    table.dropColumn('file_type');
});
