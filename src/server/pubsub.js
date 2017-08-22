import config from 'config';
import { EventEmitter } from 'events';
import { RedisClient } from './redis';
import redisClient from './redisClient';

class PubSub {
    publish() {
        throw new Error('Abstract');
    }

    subscribe() {
        throw new Error('Abstract');
    }
}

class LocalPubSub extends PubSub {
    constructor() {
        super();

        this.emitter = new EventEmitter();
    }

    publish(channel, message) {
        this.emitter.emit('message', [channel, message]);
    }

    subscribe(channel, listener) {
        this.emitter.on('message', args => listener(...args));

        return () => this.emitter.removeListener('message', listener);
    }
}

class RedisPubSub extends PubSub {
    constructor() {
        super();

        this.publisher = redisClient;
    }

    publish(channel, message) {
        this.publisher.publish(channel, JSON.stringify(message));
    }

    subscribe(channel, listener) {
        const subscriber = new RedisClient(config.get('redis'));
        subscriber.on(
            'message',
            (rcvchannel, message) => listener(rcvchannel, JSON.parse(message))
        );
        subscriber.subscribe(channel);

        return () => {
            subscriber.unsubscribe();
            subscriber.quit();
        };
    }
}

const pubsub = redisClient ? new RedisPubSub() : new LocalPubSub();

export function publish(channel, data) {
    return pubsub.publish(channel, data);
}
export function subscribe(channel, subscriber) {
    return pubsub.subscribe(channel, subscriber);
}
