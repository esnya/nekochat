import {
    created,
    joined,
    list,
    password,
    userLeft,
    userJoined,
} from '../../actions/RoomActions';
import * as ROOM from '../../constants/RoomActions';
import { PASSWORD_INCORRECT, Room } from '../models/room';
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
                    .emit('action', userLeft(this.user));
            }
        });
    }

    onDispatch(action) {
        switch (action.type) {
            case ROOM.CREATE:
                return Room
                    .insert({
                        id: generateId((new Date()).getTime() + '')
                                .substr(0, ID_LENGTH),
                        title: action.title || null,
                        password: action.password || null,
                        user_id: this.user_id,
                    })
                    .then((room) => this.dispatch(created(room)));
            case ROOM.JOIN:
                return Room
                    .join(action.id, action.password || null)
                    .then((room) => {
                        this.room_id = room.id;
                        this.socket.join(room.id);
                        this.socket.join(`${room.id}/${this.user_id}`);
                        this
                            .socket
                            .to(room.id)
                            .emit(
                                'action',
                                userJoined(this.user)
                            );
                        this.dispatch(joined(room));
                    })
                    .catch((e) => {
                        if (e === PASSWORD_INCORRECT) {
                            this.dispatch(password(action.id));
                        } else {
                            return Promise.reject(e);
                        }
                    });
            case ROOM.LEAVE:
                if (this.room_id) {
                    this
                        .socket
                        .to(this.room_id)
                        .emit(
                            'action',
                            userLeft(this.user)
                        );
                    this.socket.leave(this.room_id);
                }
                this.room_id = null;

                return this.onDispatch({type: ROOM.FETCH});
            case ROOM.FETCH:
                return Room
                    .findAll()
                    .then((rooms) => this.dispatch(list(rooms)));
            case ROOM.REMOVE:
                return Room
                    .del({
                        id: action.id,
                        user_id: this.user_id,
                    });
        }
    }
}
