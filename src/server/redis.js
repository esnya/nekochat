import bluebird from 'bluebird';
import config from 'config';
import redis from 'redis';
import { redis as logger } from './logger';

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

export class RedisClient extends redis.RedisClient {
    constructor() {
        const {
            enabled,
            ...options
        } = config.get('redis');
        if (!enabled) throw new Error('Redis is disabled');

        super(options);

        this.on('error', e => logger.error(e));
    }
}
