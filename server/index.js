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

var diceReplace = function (str, io) {
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

            if (num > 9999) {
                return NaN;
            }

            var r = [];
            for (var i = 0; i < num; ++i) {
                r.push(Math.floor(Math.random() * eye + 1));
            }

            if (io) {
                io.emit('dice', eye, r);
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

            return '[' + r.join(', ') + ']';
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
                console.error(error);
                d.reject(error);
            } else {
                d.resolve(data);
            }
        });

        return d.promise();
    },
    getAll: function (table, field, value, options) {
        var fields = (options && options.fields) ? options.fields.join(",") : '*'
        return this.query('SELECT ' + fields + ' FROM ' + table + ' WHERE ' + field + ' = ? ORDER BY modified DESC LIMIT 50', [value]);
    },
    getMessageLogs: function (room_id, id) {
        return this.query('SELECT * FROM messages WHERE room_id = ? and id < ? ORDER BY modified DESC LIMIT 20', [room_id, id]);
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
            //console.log(result);
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

    socket.on('disconnect', function () {
        console.log('Disconnected: ', socket.id, socket.user ? socket.user.id : undefined);
        if (socket.room) {
            io.to(socket.room.id).emit('user defected', socket.user);
        }
    });

    socket.on('auth request', function (user_id) {
        console.log('Auth Request: ', user_id);
        datasource.getOne('users', user_id).fail(function (error) {
            console.error(error);
        }).done(function (users) {
            var user = users[0];
            console.log('Auth OK: ', user);
            socket.emit('auth ok', user);

            socket.user = user;

            var sendMessage = function (messages) {
                //console.log('Sending Messages');
                messages.forEach(function (message) {
                    if (socket.minId == null || message.id < socket.minId) {
                        socket.minId = message.id;
                    }
                    socket.emit('add message', message);
                });
            };

            var join = function (room) {
                console.log('Join OK: ', room);
                socket.room_id = room.id;
                socket.join(room.id);
                socket.emit('join ok', room);
                io.to(room.id).emit('user joined', socket.user);

                socket.minId = null;
                datasource.getAll('messages', 'room_id', room.id).done(sendMessage);
            };

            socket.on('message request', function () {
                var room_id = socket.room_id;
                if (room_id) {
                    datasource.getMessageLogs(room_id, socket.minId).done(sendMessage);
                };
            });

            socket.on('join request', function (room_id) {
                console.log('Join Request: ', socket.id, room_id);
                datasource.getOne('rooms', room_id).fail(function (error) {
                    console.error(error);
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

            socket.on('add message', function (message) {
                if (socket.room_id && message) {
                    var msg = {
                        name: message.name,
                        room_id: socket.room_id,
                        user_id: socket.user.id,
                        message: diceReplace(message.message, io.to(socket.room_id)),
                        character_url: message.character_url
                    };
                    msg.created = msg.modified = new Date();
                    datasource.insert('messages', msg).then(function (message_id) {
                        return datasource.getOne('messages', message_id);
                    }).done(function (data) {
                        io.to(socket.room_id).emit('add message', data[0]);
                    });
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
