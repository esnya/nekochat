export class Dispatcher {
    constructor(socket, root) {
        this.root = root;
        this.socket = socket;
        this.user_id = socket.user.id;
    }

    dispatch(action, to = null, excludeSelf = false) {
        const clientAction = {
            ...action,
            server: false,
        };

        if (!to || !excludeSelf) this.socket.emit('action', clientAction);
        if (to) this.socket.to(to).emit('action', clientAction);

        (this.root || this).onDispatch(clientAction);
    }
    
    onDispatch() {
        console.error(`${this.constructor.name}.onDispatch must be overrided`);
    }
}