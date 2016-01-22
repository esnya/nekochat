export class Dispatcher {
    constructor(socket, root) {
        this.root = root;
        this.socket = socket;
        this.user_id = socket.user.id;
    }

    dispatch(action, to = null, excludeSelf = false) {
        let _action = {
            ...action,
            server: false,
        };

        if (!to || !excludeSelf) this.socket.emit('action', _action);
        if (to) this.socket.to(to).emit('action', _action);

        (this.root || this).onDispatch(_action);
    }
    
    onDispatch() {
        console.error(`${this.constructor.name}.onDispatch must be overrided`);
    }
}