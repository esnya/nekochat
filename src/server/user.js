import AppConfig from '../config/app';
import { knex } from './knex';

export const getUser = function(session) {
    let passport = session.passport || AppConfig.auth.guest && {
        user: 'guest',
    };

    if (passport) {
        let user = passport.user;

        if (user) {
            return knex('users')
                .where('id', user)
                .whereNull('deleted')
                .first('id', 'name');
        }
    }
    
    return Promise.reject(new Error('User not found'));
};