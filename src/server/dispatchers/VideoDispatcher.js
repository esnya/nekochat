import * as Video from '../../actions/VideoActions';
import * as VIDEO from '../../constants/VideoActions';
import * as ROOM from '../../constants/RoomActions';
import { Dispatcher }  from './Dispatcher';

export class VideoDispatcher extends Dispatcher {
    onDispatch(action) {
        switch(action.type) {
            case ROOM.JOINED:
                this.room_id = action.room.id;
                return null;
            case VIDEO.CREATE:
                if (!action.id) return null;
                return this.dispatch(
                    Video.push(action.id),
                    this.room_id,
                    true
                );
            case VIDEO.REMOVE:
                return this.emit(
                    Video.remove(action.id),
                    this.room_id,
                    true
                );
            case VIDEO.REQUEST:
                return this.emit(
                    Video.requested(action.to, action.callme),
                    this.room_id,
                    true
                );
        }
    }
}