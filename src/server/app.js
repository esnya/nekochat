import { urlencoded } from 'body-parser';
import config from 'config';
import express from 'express';
import Livereload from 'connect-livereload';
import moment from 'moment';
import { File } from './models/file';
import { Icon } from './models/icon';
import { Message } from './models/message';
import { NOT_FOUND } from './models/model';
import { Room, PASSWORD_INCORRECT } from './models/room';
import { User } from './models/user';
import api from './api';
import { access, system as logger } from './logger';
import { session } from './session';
import { getUser } from './user';

const browser = config.get('browser');

export const app = express();

app.use(access);

app.set('view engine', 'jade');
app.use(session);

app.get('/icon/:id', (req, res, next) => {
    Icon.find('id', req.params.id)
        .then((icon) => res.type(icon.type).send(icon.data))
        .catch(next);
});
app.get('/file/:id', (req, res, next) => {
    File.find('id', req.params.id)
        .then((file) => res.type(file.type).send(file.data))
        .catch(next);
});
app.use('/api', api);

if (config.get('app.livereload')) {
    app.use(new Livereload());
}
app.use(express.static('public'));
app.use(express.static('dist'));
app.use('/sanitize.css', express.static('node_modules/sanitize.css'));
app.use('/dice3d', express.static('node_modules/dice3d/dist'));
app.use('/js', express.static('lib/browser'));
app.use('/src', express.static('src'));

const staticView = (req, res, next) => {
    getUser(req.session)
        .then((user) => Room
            .join(req.params.roomId, req.body && req.body.password)
            .then((room) => ({ room, user }))
        )
        .then(({ room, user }) => Message
            .findAll(room.id, user.id)
            .then((messages) => ({
                ...room,
                messages: messages
                    .reverse()
                    .map((message) => ({
                        ...message,
                        modified: moment(message.modified).format('lll'),
                    })),
            }))
        )
        .then((result) => res.render('static', {
            ...result,
            ga: config.has('ga') &&
                `GA_CONFIG = ${JSON.stringify(config.get('ga'))};`,
        }))
        .catch((e) => {
            if (e === PASSWORD_INCORRECT) {
                return res.redirect(`/view/${req.params.roomId}/password`);
            } else if (e === NOT_FOUND) {
                return res.redirect('/guest');
            }
            logger.error(e);

            return next();
        });
};
app.get('/view/:roomId', staticView);
app.post('/view/:roomId', urlencoded({ extended: false }), staticView);
app.get('/view/:roomId/password', (req, res) => {
    res.render('static-password', {
        id: req.params.roomId,
    });
});

const renderIndex = (res, user = null) =>
    res.render('index', {
        config: browser,
        script: process.env.NODE_ENV === 'production'
                    ? 'js/browser.min.js'
                    : 'js/browser.js',
        ga: config.has('ga') &&
                    `GA_CONFIG = ${JSON.stringify(config.get('ga'))};`,
        user,
    }
    );

app.get('/logout', (req, res, next) => {
    if (!config.get('app.guest')) return next();

    // eslint-disable-next-line no-param-reassign
    req.session.guest = null;

    return res.redirect('/');
});
app.get('/guest', (req, res, next) => {
    if (!config.get('app.guest')) return next();

    return renderIndex(res);
});
app.post('/guest', urlencoded({ extended: false }), (req, res, next) => {
    if (!config.get('app.guest')) return next();

    const guest = {
        id: req.body.id,
        name: req.body.name,
    };

    return User.find('id', guest.id)
        .then(() => {
            next();
        })
        .catch((e) => {
            if (e !== NOT_FOUND) return next();

            // eslint-disable-next-line no-param-reassign
            req.session.guest = guest;

            return res.redirect('/');
        });
});

app.get(['/', '/:roomId'], (req, res, next) =>
    getUser(req.session)
        .then((user) => renderIndex(res, user))
        .catch((e) => {
            if (config.get('app.guest') && e === NOT_FOUND) {
                return res.redirect('/guest');
            }

            logger.error(e);
            return next(e);
        })
);
