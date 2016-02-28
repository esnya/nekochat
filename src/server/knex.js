import config from 'config';
import Knex from 'knex';

export const knex = Knex(config.get('database.default'));

export const exists = function(data) {
    return !data
        ? Promise.reject(new Error('Not found'))
        : Promise.resolve(data);
};

export const inserted = function(ids) {
    return ids.length === 0
        ? Promise.reject(new Error('Failed to insert'))
        : Promise.resolve(ids[0]);
};

Promise.all([
    knex
        .schema
        .createTableIfNotExists('users', (table) => {
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
        })
        .then(() => {
            if (config.get('app.guest')) {
                return knex('users')
                    .where('id', 'guest')
                    .first()
                    .then((user) => {
                        if (!user) {
                            return knex('users').insert({
                                id: 'guest',
                                name: 'Guest',
                            });
                        }
                    });
            }
        }),
    knex.schema.createTableIfNotExists('rooms', (table) => {
        table.string('id').primary();
        table.string('title').notNullable();
        table
            .string('user_id')
            .notNullable()
            .references('id')
            .inTable('users');
        table.string('password').nullable();
        table
            .timestamp('created')
            .notNullable()
            .defaultTo(knex.fn.now());
        table
            .timestamp('modified')
            .notNullable()
            .defaultTo(knex.fn.now());
        table.timestamp('deleted').defaultTo(null);
    }),
    knex.schema.createTableIfNotExists('messages', (table) => {
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
        table.string('character_url');
        table
            .timestamp('created')
            .notNullable()
            .defaultTo(knex.fn.now());
        table
            .timestamp('modified')
            .notNullable()
            .defaultTo(knex.fn.now());
        table.timestamp('deleted').defaultTo(null);
    }),
    knex.schema.createTableIfNotExists('icons', (table) => {
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
        table.timestamp('deleted').defaultTo(null);
    }),
]).then();
