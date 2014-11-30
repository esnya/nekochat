(function (Socket, $) {
    'use strict';

    var _socket, _user_id;

    var _deferred = {};

    var _on = {
        connect: function () {
            console.log('Connected');
            _socket.emit('auth request', _user_id);
        },
        disconnect: function () {
            console.log('Disconnected');
        },
        'auth ok': function (user) {
            console.log('Auth OK');
            _deferred.auth.resolve(user);
            _deferred.auth = null;
        },
        'join ok': function (room) {
            console.log('Join OK');
            _deferred.join.resolve(room);
            _deferred.join = null;
        },
        'join failed': function () {
            console.log('Join Failed');
            _deferred.join.reject();
            _deferred.join = null;
        }
    };

    var _bindedListeners = [];
    var _cascadeListeners = [
        'disconnect',
        'room list',
        'add message',
        'user joined',
        'user defected',
        'begin writing',
        'end writing'
    ];

    /// Connect to server with user_id
    Socket.connect = function (path, user_id) {
        _deferred.auth = new $.Deferred;

        _user_id = user_id;

        _socket = io.connect('http://' + location.hostname, { path: path, transports: ['websocket'] });

        for (var e in _on) {
            _socket.on(e, _on[e]);
        }

        _cascadeListeners.forEach(function (e) {
            _socket.on(e, function () {
                var listener = _bindedListeners[e];
                if (listener) {
                    listener.apply(this, arguments);
                }
            });
        });

        return _deferred.auth.promise();
    };

    ///
    Socket.join = function (room_id) {
        _deferred.join = new $.Deferred;

        _socket.emit('join request', room_id);

        return _deferred.join.promise();
    };

    ///
    Socket.getRoomList = function () {
        _socket.emit('room list');
    };

    ///
    Socket.sendMessage = function (message) {
        _socket.emit('add message', message);
    };

    ///
    Socket.beginWriting = function (user_id, name) {
        _socket.emit('begin writing', name);
    };

    ///
    Socket.endWriting = function (user_id) {
        _socket.emit('end writing', name);
    };

    ///
    Socket.requestMessage = function () {
        _socket.emit('message request');
    };

    /// Bind event listener
    Socket.on = function (e, callback) {
        _bindedListeners[e] = callback;
    };
})(this.Socket || (this.Socket = {}), jQuery);
