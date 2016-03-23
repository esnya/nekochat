import {Model} from './model';

export class FileModel extends Model {
    constructor() {
        super('files');
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
}

export const File = new FileModel();
