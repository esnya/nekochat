const redis = jest.fn();
module.exports = redis;

redis.RedisClient = jest.fn();
redis.Multi = jest.fn();
