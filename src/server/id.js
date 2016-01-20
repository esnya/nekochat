import crypto from 'crypto';

export const generateId = function(data = Math.random()) {
    return crypto.createHash('sha1').update(data).digest('hex');
};