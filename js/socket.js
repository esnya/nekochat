(function (Socket, $) {
    'use strict';

    var _socket, _user_id;

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
            Socket.join(location.hash);
        },
        'join ok': function (room) {
            console.log('Join OK');
        },
        'join failed': function () {
            console.log('Join Failed');
        }
    };

    var _bindedListeners = [];
    var _cascadeListeners = [
        'disconnect',
        'room list',
        'join ok',
        'join failed',
        'add message',
        'user joined',
        'user defected',
        'begin writing',
        'end writing'
    ];

    /// Connect to server with user_id
    Socket.connect = function (path, user_id) {
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
    };

    ///
    Socket.join = function (room_id) {
        _socket.emit('join request', room_id);
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