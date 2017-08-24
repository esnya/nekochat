import config from 'config';
import { NOT_FOUND } from './models/model';
import { User } from './models/user';
import knex from './knex';

export const getUser = session => User
    .find('id', session && session.passport && session.passport.user || null)
    .catch((e) => {
        if (config.get('app.guest') && e === NOT_FOUND && session && session.guest) {
            return session.guest;
        }

        return Promise.reject(e);
    });

export const authorize = () => (req, res, next) => (new Promise((resolve, reject) => {
    const { session } = req;
    const { guest, passport } = session || {};
    const { user } = passport || {};

    if (user) {
        return knex('users')
            .where('id', user)
            .whereNull('deleted')
            .first()
            .then((data) => {
                if (data) resolve(data);
                else reject();
            });
    } else if (!user && config.get('app.guest') && guest) {
        return resolve(guest);
    }

    return reject();
}))
    .then((user) => {
    // eslint-disable-next-line no-param-reassign
        req.user = user;
        next();
    }, () => res.send(401));
