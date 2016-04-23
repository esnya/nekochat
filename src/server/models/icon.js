import {Model} from './model';

export class IconModel extends Model {
    constructor() {
        super('icons', 'name', 'ASC');
    }

    create(table) {
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
            .defaultTo(this.fn.now());
        table
            .timestamp('modified')
            .notNullable()
            .defaultTo(this.fn.now());
        table.timestamp('deleted').defaultTo(null);
    }

    findAll(...finder) {
        return super
            .findAll(...finder)
            .select('id', 'user_id', 'name', 'type', 'created', 'modified');
    }
}

export const Icon = new IconModel();
