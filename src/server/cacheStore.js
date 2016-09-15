import config from 'config';
import _ from 'lodash';
import redisClient from './redisClient';

class CacheStore {
    constructor() {
        this.expire = config.get('cache.expire');
    }

    hset() {
        return Promise.reject(); // abstract
    }

    hget() {
        return Promise.reject(); // abstract
    }

    hgetall() {
        return Promise.reject(); // abstract
    }
}

class MemoryCacheStore extends CacheStore {
    constructor() {
        super();

        this.hash = {};
        this.cleaned = Date.now();
    }

    hset(key, field, value) {
        if (!(key in this.hash)) {
            this.hash[key] = {
                data: {},
            };
        }

        const hash = this.hash[key];
        hash.expire = Date.now() + this.expire * 1000;
        hash.data[field] = value;

        return Promise.resolve();
    }

    hget(key, field) {
        if (!(key in this.hash)) return Promise.reject();

        const hash = this.hask[key];
        if (!(field in hash)) return Promise.reject();

        return Promise.resolve(hash[field]);
    }

    hgetall(key) {
        if (!(key in this.hash)) return Promise.reject();

        const hash = this.hask[key];
        return Promise.resolve(hash.data);
    }
}

class RedisCacheStore extends CacheStore {
    constructor() {
        super();

        this.redis = redisClient;
    }

    hset(key, field, value) {
        return this.redis.multi()
            .hset(key, JSON.stringify(value))
            .expire(key, this.expire)
            .execAsync();
    }

    hget(key, field) {
        return this.redis
            .hgetAsync(key, field)
            .then(value => value && JSON.parse(value));
    }

    hgetall(key) {
        return this.redis
            .hgetallAsync(key)
            .then(obj => _.mapValues(obj, value => JSON.parse(value)));
    }
}

export default redisClient ? new RedisCacheStore() : new MemoryCacheStore();
