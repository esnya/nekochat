import config from 'config';
import {getLogger} from 'log4js';
import {createClient} from 'redis';
import {handle} from './handlers';

const logger = getLogger('[connection]');

export class Connection {
    constructor(socket, user) {
        this.user = user;

        this.initSocket(socket);
        this.initRedis();
        this.initSubscriber();
        this.initWhisperSubscriber();
    }

    initSocket(socket) {
        this.socket = socket;

        socket.on('action', (action) => this.dispatch(action));
        socket.on('disconnedt', () => this.onClose());
    }
    initRedis() {
        this.redis = createClient(config.get('redis'));
    }
    initSubscriber() {
        const subscriber =
            this.subscriber = createClient(config.get('redis'));

        subscriber.on('message', (channel, message) =>
            this.onMessage(channel, JSON.parse(message))
        );
    }
    initWhisperSubscriber() {
        const subscriber =
            this.whisperSubscriber = createClient(config.get('redis'));

        subscriber.on('message', (channel, message) =>
            this.onMessage(channel, JSON.parse(message))
        );
    }

    onMessage(channel, {action, sender}) {
        if (sender === this.socket.id) return;

        logger.info('action', this.user.id, this.socket.id, action.type);
        this.emit(action);
    }
    onClose() {
        this.redis.quit();
        this.subscriber.quit();
    }

    join(room) {
        this.leave();
        this.room = room;

        const room_key = this.room_key = `nekochat:${room.id}`;

        this.subscriber.subscribe(room_key);
        this.whisperSubscriber.subscribe(`${room_key}:${this.user.id}`);
    }
    leave() {
        if (this.room) {
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
        this.socket.emit('action', action);
    }
    publish(action, whisper = false) {
        if (!this.room_key) return;

        const channel = whisper
            ? `${this.room_key}:${this.user.id}`
            : this.room_key;

        this.redis.publish(channel, JSON.stringify({
            sender: this.socket.id,
            action,
        }));
    }
}
