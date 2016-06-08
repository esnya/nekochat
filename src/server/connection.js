import config from 'config';
import {getLogger} from 'log4js';
import {createClient} from 'redis';
import {handle} from './handlers';

const logger = getLogger('[connection]');

export class Connection {
    constructor(socket, user) {
        this.logger = logger;
        this.user = user;

        this.initSocket(socket);
        this.initRedis();
        this.initSubscriber();
        this.initWhisperSubscriber();
    }

    initSocket(socket) {
        this.socket = socket;

        socket.on('action', (action) => this.dispatch(action));
    }
    initRedis() {
        this.redis = createClient(config.get('redis'))
            .on('error', (e) => logger.error(e));
    }
    initSubscriber() {
        const subscriber =
            this.subscriber = createClient(config.get('redis'))
                .on('error', (e) => logger.error(e));

        subscriber.on('message', (channel, message) =>
            this.onMessage(channel, JSON.parse(message))
        );
    }
    initWhisperSubscriber() {
        const subscriber =
            this.whisperSubscriber = createClient(config.get('redis'))
                .on('error', (e) => logger.error(e));

        subscriber.on('message', (channel, message) =>
            this.onMessage(channel, JSON.parse(message))
        );
    }

    onMessage(channel, {action, sender}) {
        if (sender === this.socket.id) return;

        logger.info('action', this.user.id, this.socket.id, action.type);
        this.emit(action);
    }

    close() {
        this.leave();
        this.redis.quit();
        this.subscriber.quit();
    }

    touch(login = true) {
        if (!this.room) return;

        this.redis.hset(`${this.room_key}:users`, this.user.id, JSON.stringify({
            ...this.user,
            login,
            timestamp: Date.now(),
        }));
    }

    join(room) {
        this.leave();
        this.room = room;

        const room_key = this.room_key = `nekochat:${room.id}`;

        this.touch(true);
        this.subscriber.subscribe(room_key);
        this.whisperSubscriber.subscribe(`${room_key}:${this.user.id}`);
    }
    leave() {
        if (this.room) {
            this.touch(false);

            this.room = null;

            this.subscriber.unsubscribe();
            this.whisperSubscriber.unsubscribe();
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

        this.redis.publish(channel, JSON.stringify({
            sender: this.socket.id,
            action: {
                type,
                payload,
                meta: {
                    ...meta,
                    sender: this.socket.id,
                },
            },
        }));
    }
}
