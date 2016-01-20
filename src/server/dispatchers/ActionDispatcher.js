import { Dispatcher } from './Dispatcher';
import { IconDispatcher } from './IconDispatcher';
import { InputDispatcher } from './InputDispatcher';
import { MessageDispatcher } from './MessageDispatcher';
import { RoomDispatcher } from './RoomDispatcher';

export class ActionDispatcher extends Dispatcher {
    constructor(socket) {
        super(socket);

        this.dispatchers = [
            new IconDispatcher(socket, this),
            new InputDispatcher(socket, this),
            new MessageDispatcher(socket, this),
            new RoomDispatcher(socket, this),
        ];
    }

    onDispatch(action) {
        console.log('action', action);
        this.dispatchers.forEach(a => a.onDispatch(action));
    }
}