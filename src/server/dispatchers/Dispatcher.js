import { getLogger } from 'log4js';

export class Dispatcher {
    constructor(socket, root) {
        this.root = root;
        this.socket = socket;
        this.user = socket.user;
        this.user_id = socket.user.id;
        this.logger = getLogger(`[SOCKET${this.socket.id}]`);
    }

    emit(action, to = null, excludeSelf = false) {
        const clientAction = {
            ...action,
            server: false,
        };

        if (!to || !excludeSelf) this.socket.emit('action', clientAction);
        if (to) {
            if (Array.isArray(to)) {
                to.forEach((t) => {
                    this
                        .socket
                        .to(t)
                        .emit('action', clientAction);
                });
            } else {
                this
                    .socket
                    .to(to)
                    .emit('action', clientAction);
            }
        }

        return clientAction;
    }

    dispatch(action, to = null, excludeSelf = false) {
        return (this.root || this)
            .onDispatch(this.emit(action, to, excludeSelf));
    }

    onDispatch() {
        const error = new Error(
            `${this.constructor.name}.onDispatch must be overrided`
        );

        this.logger.error(error);

        return Promise.reject(error);
    }
}
