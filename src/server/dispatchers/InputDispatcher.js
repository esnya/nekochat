import { knex, exists, inserted } from '../knex.js';
import * as Input from '../../actions/InputActions';
import * as INPUT from '../../constants/InputActions';
import * as ROOM from '../../constants/RoomActions';
import { Dispatcher }  from './Dispatcher';

export class InputDispatcher extends Dispatcher {
    onDispatch(action) {
        switch(action.type) {
            case ROOM.JOINED:
                this.room_id = action.room.id;
                return;
            case INPUT.BEGIN:
                this.dispatch(Input.began({
                    id: this.socket.id,
                    user_id: this.user_id,
                    name: action.name,
                    message: action.message,
                }), this.room_id, true);
                return;
            case INPUT.END:
                this.dispatch(Input.ended({
                    id: this.socket.id,
                    user_id: this.user_id,
                    name: action.name,
                }), this.room_id, true);
                return;
        }
    }
}