import {Model} from './model';

export const PASSWORD_INCORRECT = 'ROOM_PASSWORD_INCORRECT';

export class RoomModel extends Model {
    constructor() {
        super('rooms');
    }

    create(table) {
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

    transform(room) {
        return {
            ...room,
            password: Boolean(room.password),
        };
    }

    findAll() {
        return super
            .findAll()
            .then((items) => items.map(this.transform));
    }

    find(...finder) {
        return super
            .find(...finder)
            .then(this.transform);
    }

    join(id, password = null) {
        return super
            .find('id', id)
            .then((room) => {
                if (room.password && room.password !== password) {
                    return Promise.reject(PASSWORD_INCORRECT);
                }

                return this.transform(room);
            });
    }
}

export const Room = new RoomModel();
