import {Model} from './model';

export const PASSWORD_INCORRECT = 'ROOM_PASSWORD_INCORRECT';

export class RoomModel extends Model {
    constructor() {
        super('rooms');
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
