'use strict';

function create(knex, name, creator) {
    return knex.schema
        .hasTable(name)
        .then((exists) => {
            if (!exists) return knex.schema.createTable(name, creator);
        });
}

exports.up = (knex, Promise) => Promise.all([
    create(knex, 'users', (table) => {
        table.string('id').primary();
        table.string('name').notNullable();
        table
            .timestamp('created')
            .notNullable()
            .defaultTo(knex.fn.now());
        table
            .timestamp('modified')
            .notNullable()
            .defaultTo(knex.fn.now());
        table.timestamp('deleted');
    }),
    create(knex, 'rooms', (table) => {
        table.string('id').primary();
        table.string('title').notNullable();
        table
            .string('user_id')
            .notNullable()
            .references('id')
            .inTable('users');
        table.string('password').nullable();
        table
            .enum('state', ['open', 'close'])
            .notNullable()
            .defaultTo(['open']);
        table.text('notes').nullable();
        table
            .timestamp('created')
            .notNullable()
            .defaultTo(knex.fn.now());
        table
            .timestamp('modified')
            .notNullable()
            .defaultTo(knex.fn.now());
        table.timestamp('deleted');
    }),
    create(knex, 'icons', (table) => {
        table.string('id').primary();
        table
            .string('user_id')
            .notNullable()
            .references('id')
            .inTable('users');
        table.string('name').notNullable();
        table.string('type').notNullable();
        table.binary('data').notNullable();
        table
            .timestamp('created')
            .notNullable()
            .defaultTo(knex.fn.now());
        table
            .timestamp('modified')
            .notNullable()
            .defaultTo(knex.fn.now());
        table.timestamp('deleted');
    }),
    create(knex, 'messages', (table) => {
        table.increments('id').primary();
        table
            .string('room_id')
            .notNullable()
            .references('id')
            .inTable('rooms');
        table
            .string('user_id')
            .notNullable()
            .references('id')
            .inTable('users');
        table
            .string('icon_id')
            .references('id')
            .inTable('icons');
        table
            .string('whisper_to')
            .nullable()
            .references('id')
            .inTable('users');
        table.string('name').notNullable();
        table.string('message').notNullable();
        table.string('character_url').nullable();
        table.string('file_id').nullable();
        table
            .timestamp('created')
            .notNullable()
            .defaultTo(knex.fn.now());
        table
            .timestamp('modified')
            .notNullable()
            .defaultTo(knex.fn.now());
        table.timestamp('deleted');
    }),
    create(knex, 'files', (table) => {
        table.string('id').primary();
        table
            .string('user_id')
            .notNullable()
            .references('id')
            .inTable('users');
        table.string('name').notNullable();
        table.string('type').notNullable();
        table.binary('data').notNullable();
        table
            .timestamp('created')
            .notNullable()
            .defaultTo(knex.fn.now());
        table
            .timestamp('modified')
            .notNullable()
            .defaultTo(knex.fn.now());
        table.timestamp('deleted');
    }),
]);

exports.down = (knex, Promise) => Promise.all([
    // knex.schema.dropTable('users'),
    knex.schema.dropTable('rooms'),
    knex.schema.dropTable('icons'),
    knex.schema.dropTable('messages'),
    knex.schema.dropTable('files'),
]);
