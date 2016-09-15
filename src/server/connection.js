/* eslint camelcase: "off" */

import { getLogger } from 'log4js';
import cacheStore from './cacheStore';
import { publish, subscribe } from './pubsub';
import { handle } from './handlers';

const logger = getLogger('[connection]');

export class Connection {
    constructor(socket, user) {
        this.logger = logger;
        this.user = user;

        this.initSocket(socket);
    }

    initSocket(socket) {
        this.socket = socket;

        socket.on('action', (action) => this.dispatch(action));
    }

    onMessage(channel, { action, sender }) {
        if (sender === this.socket.id) return;

        logger.info('action', this.user.id, this.socket.id, action.type);
        this.emit(action);
    }

    close() {
        this.leave();
    }

    touch(login = true) {
        if (!this.room) return;

        cacheStore.hset(`${this.room_key}:users`, this.user.id, {
            ...this.user,
            login,
            timestamp: Date.now(),
        });
    }

    join(room) {
        this.leave();
        this.room = room;

        const room_key = this.room_key = `nekochat:${room.id}`;

        this.touch(true);
        this.unsubscribe = subscribe(room_key, (...args) => this.onMessage(...args));
        this.unsubscribeWhisper =
            subscribe(`${room_key}:${this.user.id}`, (...args) => this.onMessage(...args));
    }
    leave() {
        if (this.room) {
            this.touch(false);

            this.room = null;

            this.unsubscribe();
            this.unsubscribeWhisper();
        }
    }

    dispatch(action) {
        logger.info('action', this.user.id, this.socket.id, action.type);

        return new Promise((resolve) =>
            handle(this)(resolve)(action)
        );
    }
    emit(action) {
        if (!action.type) {
            this.logger.error('action.type must be defined');

            return;
        }

        this.socket.emit('action', {
            ...action,
            meta: {
                ...action.meta,
                sync: false,
            },
        });
    }
    publish({ type, payload, meta }, whisper_to = null) {
        if (!this.room_key) return;

        const channel = whisper_to
            ? `${this.room_key}:${whisper_to}`
            : this.room_key;

        publish(channel, {
            sender: this.socket.id,
            action: {
                type,
                payload,
                meta: {
                    ...meta,
                    sender: this.socket.id,
                },
            },
        });
    }
}
