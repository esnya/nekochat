'use strict';

var jQuery = require('jquery-deferred');
var crypto = require('crypto');

var config = {
    app: require('../config/app.json'),
    database: require('../config/database.json')
};

var io = require('socket.io').listen(config.app.port, {
    path: config.app.path
});

var database = require('mysql').createConnection(config.database);
database.connect();

var diceReplace = function (str) {
    return str;
};
var diceReplace = function (str) {
    return str.replace(/([0-9]*d[0-9]*|[0-9]+)([+-][0-9]*d[0-9]*|[+-][0-9]+)*=/g, function (exp) {
        var status = '';

        var diced = exp.replace(/([0-9]*)d([0-9]*)/g, function (dice) {
            var s = dice.split('d');
            var num = 1;
            var eye = 6;

            if (dice.charAt(0) == 'd') {
                eye = +s[0];
            } else {
                num = +s[0];
                if (s.length == 2 && s[1]) {
                    eye = +s[1];
                }
            }

            var r = [];
            for (var i = 0; i < num; ++i) {
                r.push(Math.floor(Math.random() * eye + 1));
            }

            if (num > 1) {
                if (r.every(function (n) {
                    return n == 1
                })) {
                    status = '(1ゾロ)';
                } else if (r.every(function (n) {
                    return n == eye
                })) {
                    status = '(' + eye + 'ゾロ)';
                }
            }

            return '[' + r.join(',') + ']';
        });

        var sum = eval(diced.replace(/[\[,]/g, '+').replace(/]/g, '').slice(0, -1));

        return exp + diced + sum + status;
    });
};

var datasource = {
    query: function (query, params) {
        var d = new jQuery.Deferred;

        //console.log('Query: ', query, params);
        database.query(query, params, function (error, data) {
            if (error) {
                d.reject(error);
            } else {
                d.resolve(data);
            }
        });

        return d.promise();
    },
    getAll: function (table, field, value, options) {
        var fields = (options && options.fields) ? options.fields.join(",") : '*'
        return this.query('SELECT ' + fields + ' FROM ' + table + ' WHERE ' + field + ' = ?', [value]);
    },
    getMessgeLogs: function (id) {
        return this.query('SELECT * FROM messages WHERE id < ? LIMIT 5', [id]);
    },
    get: function (table, id, options) {
        var fields = (options && options.fields) ? options.fields.join(",") : '*'
        return this.query('SELECT ' + fields + ' FROM ' + table + ' WHERE id = ?', [id]);
    },
    getOne: function (table, id) {
        var d = new jQuery.Deferred;

        this.get(table, id).done(function (data) {
            if (data.length == 1) {
                d.resolve(data);
            } else {
                d.reject('Not Found');
            }
        }).fail(function (error) {
            d.reject(error);
        });

        return d.promise();
    },
    notExists: function (table, id) {
        var d = new jQuery.Deferred;

        this.get(table, id, { fields: ['id'] }).done(function (data) {
            if (data.length == 0) {
                d.resolve();
            } else {
                d.reject();
            }
        }).fail(function (error) {
            d.reject(error);
        });

        return d.promise();
    },
    insert: function (table, data) {
        var d = new jQuery.Deferred;

        data.created = new Date;
        data.modified = new Date;

        var fields = [];
        var holders = [];
        var values = [];

        for (var key in data) {
            fields.push(key);
            holders.push('?');
            values.push(data[key]);
        }

        this.query('INSERT INTO ' + table + ' (' + fields.join(",") + ') VALUES (' + holders.join(",") + ')', values).fail(function (error) {
            d.reject(error);
        }).done(function (result) {
            console.log(result);
            if (result.affectedRows == 1) {
                d.resolve(data.id || result.insertId);
            } else {
                d.reject('No affected rows');
            }
        });

        return d.promise();
    }
};

io.on('connect', function (socket) {
    console.log('New Connection: ', socket.id);

    socket.emit('hello');

    socket.on('auth request', function (user) {
        console.log('Auth Request: ', user);
        datasource.getOne('users', user.id).fail(function (error) {
            console.log(error);
        }).done(function (data) {
            console.log('Auth OK: ', data[0]);
            socket.emit('auth ok');

            socket.user = data[0];

            var join = function (room) {
                console.log('Join OK: ', room);
                socket.room_id = room.id;
                socket.join(room.id);
                socket.emit('join ok', room);
                io.to(room.id).emit('joined', socket.user);

                datasource.getAll('messages', 'room_id', room.id).done(function (messages) {
                    messages.forEach(function (message) {
                        socket.emit('message', message);
                    });
                });
            };

            socket.on('join request', function (room_id) {
                console.log('Join Request: ', socket.id, room_id);
                datasource.getOne('rooms', room_id).fail(function (error) {
                    console.log(error);
                    socket.emit('join failed');
                }).done(function (rooms) {
                    join(rooms[0]);
                });
            });

            var createRoom = function (title, game_id, user_id, id) {
                var d = new jQuery.Deferred;

                if (!id) {
                    id = '' + (new Date).getTime();
                }

                id = crypto.createHash('sha256').update(id).digest('hex').substr(0, 16);

                datasource.notExists('rooms', '#' + id).fail(function (error) {
                    if (error == "exists") {
                        createRoom(id, title, game);
                    }
                }).done(function () {
                    datasource.insert('rooms', {
                        id: '#' + id,
                        title: title,
                        user_id: user_id,
                        game_id: game_id
                    }).fail(function (error) {
                        d.reject(error);
                    }).done(function (insertId) {
                        datasource.getOne('rooms', insertId).fail(function (error) {
                            d.reject(error);
                        }).done(function (rooms) {
                            console.log(rooms);
                            d.resolve(rooms[0]);
                        });
                    });
                });

                return d.promise();
            };

            socket.on('create room', function (title, game_id) {
                createRoom(title, game_id, socket.user.id).fail(function (error) {
                    console.log('Create Failed: ', error);
                    socket.emit('join failed');
                }).done(function (room) {
                    join(rooms[0]);
                });
            });

            socket.on('room list', function () {
                datasource.getAll('rooms', 'user_id', socket.user.id).fail(function (error) {
                    console.log('Room List: ', error);
                }).done(function (rooms) {
                    socket.emit('room list', rooms);
                });
            });

            socket.on('message', function (name, message, character_url) {
                if (socket.room_id) {
                    var msg = {
                        name: name,
                        room_id: socket.room_id,
                        user_id: socket.user.id,
                        message: diceReplace(message),
                        character_url: character_url
                    };
                    console.log(name, msg);
                    msg.created = msg.modified = new Date();
                    datasource.insert('messages', msg);
                    io.to(socket.room_id).emit('message', msg);
                }
            });

            socket.on('writing', function (name) {
                if (socket.room_id) {
                    io.to(socket.room_id).emit('writing', socket.user.id, name);
                }
            });
        });
    });
});
