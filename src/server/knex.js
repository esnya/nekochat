import Knex from 'knex';

export const knex = Knex(require('../config/database').default);

Promise.all([
    knex.schema.createTableIfNotExists('users', table => {
        table.string('id').primary();
        table.string('name').notNullable();
        table.timestamp('created').notNullable().defaultTo(knex.fn.now());
        table.timestamp('modified').notNullable().defaultTo(knex.fn.now());
        table.timestamp('deleted');
    }),
    knex.schema.createTableIfNotExists('rooms', table => {
        table.string('id').primary();
        table.string('title').notNullable();
        table.string('user_id').notNullable();
        table.timestamp('created').notNullable().defaultTo(knex.fn.now());
        table.timestamp('modified').notNullable().defaultTo(knex.fn.now());
        table.timestamp('deleted').defaultTo(null);
    }),
    knex.schema.createTableIfNotExists('messages', table => {
        table.increments('id').primary();
        table.string('room_id').notNullable();
        table.string('user_id').notNullable();
        table.string('name').notNullable();
        table.string('message').notNullable();
        table.string('character_url');
        table.string('icon_id');
        table.timestamp('created').notNullable().defaultTo(knex.fn.now());
        table.timestamp('modified').notNullable().defaultTo(knex.fn.now());
        table.timestamp('deleted').defaultTo(null);
    }),
    knex.schema.createTableIfNotExists('icons', table => {
        table.string('id').primary();
        table.string('user_id').notNullable();
        table.string('name').notNullable();
        table.string('type').notNullable();
        table.binary('data').notNullable();
        table.timestamp('created').notNullable().defaultTo(knex.fn.now());
        table.timestamp('modified').notNullable().defaultTo(knex.fn.now());
        table.timestamp('deleted').defaultTo(null);
    }),
]).then(() => {
    return knex.raw('CREATE VIEW IF NOT EXISTS room_histories AS SELECT rooms.* FROM messages LEFT JOIN rooms ON messages.room_id = rooms.id  GROUP BY messages.user_id, messages.room_id').then();
});