import {Model} from './model';

export class UserModel extends Model {
    constructor() {
        super('users');
    }

    create(table) {
        table.string('id').primary();
        table.string('name').notNullable();
        table
            .timestamp('created')
            .notNullable()
            .defaultTo(this.fn.now());
        table
            .timestamp('modified')
            .notNullable()
            .defaultTo(this.fn.now());
        table.timestamp('deleted');
    }
}

export const User = new UserModel();