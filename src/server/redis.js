import bluebird from 'bluebird';
import { RedisClient, Multi } from 'redis';

bluebird.promisifyAll(RedisClient.prototype);
bluebird.promisifyAll(Multi.prototype);

export * from 'redis';
