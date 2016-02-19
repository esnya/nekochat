import { getLogger } from 'log4js';
import { Dispatcher } from './Dispatcher';
import { IconDispatcher } from './IconDispatcher';
import { InputDispatcher } from './InputDispatcher';
import { MessageDispatcher } from './MessageDispatcher';
import { RoomDispatcher } from './RoomDispatcher';

const logger = getLogger('[ACTION]');

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
        logger.debug(action.type);
        return Promise.all(
            this.dispatchers.map((d) => d.onDispatch(action))
        );
    }
}