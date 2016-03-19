import config from 'config';
import {NOT_FOUND} from './models/model';
import {User} from './models/user';

export const getUser = (session) => User
    .find('id', session && session.passport && session.passport.user)
    .catch((e) => {
        if (config.get('app.guest') && e === NOT_FOUND && session.guest) {
            return session.guest;
        }

        return Promise.reject(e);
    });
