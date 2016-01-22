import express from 'express';
import Livereload from 'connect-livereload';
import { knex, exists } from './knex';
import { session } from './session';

export const app = express();

app.set('view engine', 'jade');
app.use(session);

app.get('/icon/:id', (req, res, next) => {
    knex('icons')
        .where('id', req.params.id)
        .whereNull('deleted')
        .first()
        .then(exists)
        .then((icon) => res.type(icon.type).send(icon.data))
        .catch(next);
});

app.use(Livereload());
app.use(express.static('public'));
app.use(express.static('dist'));
app.use('/dice3d', express.static('node_modules/dice3d/dist'));
app.use('/js', express.static('lib/browser'));
app.use('/src', express.static('src'));

app.get('/view/:roomId', (req, res, next) => {
    knex('rooms')
        .where('id', req.params.roomId)
        .whereNull('deleted')
        .first()
        .then(exists)
        .then((room) => knex('messages')
            .where('room_id', room.id)
            .whereNull('deleted')
            .orderBy('id', 'asc')
            .then((messages) => ({
                ...room,
                messages,
            }))
        )
        .then((result) => res.render('static', result))
        .catch(() => next);
});

app.get(['/', '/:roomId'], (req, res) => {
    res.render('index');
});