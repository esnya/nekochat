import config from 'config';
import { RedisClient } from './redis';

const {
    enabled,
    ...options
} = config.get('redis');

export default enabled ? new RedisClient(options) : null;
