import { getLogger } from 'log4js';
import moment from 'moment';

import knex from './knex';

const logger = getLogger('[data-cleaner]');

const cleanTables = {
    file: 'files',
    room: 'rooms',
};

const clean = (type, duration, hard) => {
    const timestamp = moment().subtract(duration).format();

    const cleanMessages = (room) =>
        knex('messages')
            .where('room_id', room.id)
            .del()
            .then(() => {});

    const preprocess = (hard && type === 'room')
        ? knex('rooms')
            .where('modified', '<', timestamp)
            .select()
            .then((rooms) => Promise.all(rooms.map(cleanMessages)))
        : Promise.resolve();

    preprocess
        .then(() => {
            const target = knex(cleanTables[type])
                .where('modified', '<', timestamp);

            return hard
                ? target.del()
                : target
                    .whereNull('deleted')
                    .update('deleted', knex.fn.now());
        })
        .then((affecteds) => {
            if (affecteds > 0) {
                logger.info(
                    `${hard ? 'hard' : 'soft'} deleted ${affecteds} ${type}(s)`
                );
            }
        })
        .catch((e) => logger.error(e));
};

const run = (type, options) => {
    if (!options) return;

    const {
        enabled,
        soft,
        hard,
    } = options;

    if (!enabled) return;

    const interval = moment.duration(options.interval).valueOf();

    if (soft) {
        setInterval(() => clean(type, moment.duration(soft), false), interval);
    }

    if (hard) {
        setInterval(() => clean(type, moment.duration(hard), true), interval);
    }
};

export const runAll = (cleaners) => {
    Object.keys(cleaners)
        .forEach((key) => run(key, cleaners[key]));
};
