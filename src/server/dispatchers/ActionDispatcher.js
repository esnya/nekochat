import { Dispatcher } from './Dispatcher';
import { MessageDispatcher } from './MessageDispatcher';
import { MessageListDispatcher } from './MessageListDispatcher';
import { RoomDispatcher } from './RoomDispatcher';
import { RoomListDispatcher } from './RoomListDispatcher';

export class ActionDispatcher extends Dispatcher {
    constructor(socket) {
        super(socket);

        this.dispatchers = [
            new MessageDispatcher(socket, this),
            new MessageListDispatcher(socket, this),
            new RoomDispatcher(socket, this),
            new RoomListDispatcher(socket, this),
        ];
    }

    onDispatch(action) {
        console.log('action', action);
        this.dispatchers.forEach(a => a.onDispatch(action));
    }
}