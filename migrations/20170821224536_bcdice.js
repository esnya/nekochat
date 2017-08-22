'use strict';

exports.up = (knex) =>
    knex.schema.table('rooms', table => {
        table
            .string('dice')
            .notNullable()
            .defaultTo('fluorite');
    });

exports.down = (knex) =>
    knex.schema.table('rooms', table => {
        table.dropColumn('dice');
    });
