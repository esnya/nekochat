import * as Room from '../../actions/RoomActions';
import * as ROOM from '../../constants/RoomActions';
import { knex, exists } from '../knex.js';
import { Dispatcher } from './Dispatcher';
import { generateId } from '../../utility/id';

const ID_LENGTH = 16;

export class RoomDispatcher extends Dispatcher {
    constructor(socket, root) {
        super(socket, root);

        socket.on('disconnect', () => {
            if (this.room_id) {
                socket
                    .server
                    .to(this.room_id)
                    .emit('action', Room.userLeft(this.user));
            }
        });
    }

    onDispatch(action) {
        switch (action.type) {
            case ROOM.CREATE: {
                const id = generateId((new Date()).getTime() + '')
                    .substr(0, ID_LENGTH);

                return knex('rooms')
                    .insert({
                        id,
                        title: action.title || null,
                        password: action.password || null,
                        user_id: this.user_id,
                        created: knex.fn.now(),
                        modified: knex.fn.now(),
                    })
                    .then(() => knex('rooms')
                        .where('id', id)
                        .whereNull('deleted')
                        .first()
                    )
                    .then(exists)
                    .then((room) => this.dispatch(Room.created(room)));
            } case ROOM.JOIN:
                return knex('rooms')
                    .where('id', action.id)
                    .whereNull('deleted')
                    .first()
                    .then(exists)
                    .then((room) =>
                        this.room_id
                            ? this.onDispatch({type: ROOM.LEAVE})
                                .then(() => room)
                            : room
                    )
                    .then((room) => {
                        if (room.password === null ||
                            room.password === action.password
                        ) {
                            this.room_id = room.id;
                            this.socket.join(room.id);
                            this.socket.join(`${room.id}/${this.user_id}`);
                            this
                                .socket
                                .to(room.id)
                                .emit(
                                    'action',
                                    Room.userJoined(this.user)
                                );
                            this.dispatch(Room.joined(room));
                        } else {
                            this.dispatch(Room.password(room.id));
                        }
                    });
            case ROOM.LEAVE:
                if (this.room_id) {
                    this
                        .socket
                        .to(this.room_id)
                        .emit(
                            'action',
                            Room.userLeft(this.user)
                        );
                    this.socket.leave(this.room_id);
                }
                this.room_id = null;
                return this.onDispatch({type: ROOM.FETCH});
            case ROOM.FETCH:
                return knex('rooms')
                        .whereNull('deleted')
                        .orderBy('created', 'desc')
                        .then((rooms) => rooms.map((room) => ({
                            ...room,
                            password: !!room.password,
                        })))
                        .then((rooms) => this.dispatch(Room.list(rooms)));
            case ROOM.REMOVE:
                return knex('rooms')
                    .where('id', action.id)
                    .where('user_id', this.user_id)
                    .whereNull('deleted')
                    .update({
                        deleted: knex.fn.now(),
                    })
                    .then(() => action.id);
        }
    }
}
