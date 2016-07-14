import crypto from 'crypto';

const seed = Date.now() * Math.random();
let serial = 1;

export const generateId = (data = (`${seed}:${serial++}`)) =>
    crypto
        .createHash('sha1')
        .update(data)
        .digest('hex');
export const genId = generateId;
