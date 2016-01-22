import crypto from 'crypto';
import express from 'express';
import fs from 'fs-promise';
import Livereload from 'connect-livereload';
import Multiparty from 'connect-multiparty';
import { knex, exists } from './knex';
import { session } from './session';
import { getUser } from './user';

export const app = express();

app.set('view engine', 'jade');
app.use(session);

app.get('/icon/:id', function(req, res, next) {
    knex('icons')
        .where('id', req.params.id)
        .whereNull('deleted')
        .first()
        .then(exists)
        .then(icon => res.type(icon.type).send(icon.data))
        .catch(next);
});

app.use(Livereload());
app.use(express.static('dist'));
app.use('/angular-material', express.static('node_modules/angular-material'));
app.use('/dice3d', express.static('node_modules/dice3d/dist'));
app.use('/js', express.static('lib/browser'));
app.use('/src', express.static('src'));

app.get('/view/:roomId', function(req, res) {
    var roomId = '#' + req.params.roomId;

    var onError = function() {
        res.writeHead(500);
        res.end('500 Internal Server Error');
    };

    knex('rooms')
        .where('id', roomId)
        .whereNull('deleted')
        .then(function(room) {
            if (!room) return onError();

            knex('messages')
                .where('room_id', roomId)
                .whereNull('deleted')
                .then(
                    function(messages) {
                        var lines = messages.map(function(message) {
                            return `
                                <tr>
                                    <td>${message.name} @${message.user_id}</td>
                                    <td>${message.message.replace(/\t/g, ' ').replace(/\r?\n/g, '<br>')}</td>
                                    <td>${message.modified}</td>
                                </tr>
                                `;
                        });
                        var html = `
                            <!DOCTYPE html>
                            <html lang="ja">
                            <head>
                                <meta charset="UTF-8">
                                <title>${room.title}</title>
                            </head>
                            <body>
                                <table>
                                    <tbody>
                                        ${lines.join('\n')}
                                    </tbody>
                                </table>
                            </body>
                            </html>
                            `;
                        res.end(html);
                    }, onError);
        }, onError);
});
app.get('/view', function(req, res) {
    res.end('<script>location.href = location.hash.substr(1);</script>');
});

app.get(['/', '/:roomId'], function(req, res) {
    res.render('index');
});