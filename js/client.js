(function (Client) {
    var _user_id;
    var _user;

    Socket.on('disconnect', function () {
        View.showConnectingModal();
    });

    Socket.on('add message', function (message) {
        View.addMessage(message);
    });

    Socket.on('user joined', function (user) {
        View.addUser(user);
    });

    Socket.on('user defected', function (user) {
        View.removeUser(user);
    });

    Socket.on('room list', function (rooms) {
        View.setRoomList(rooms);
    });

    Socket.on('begin writing', function (id, name) {
        if (id != _user.id) {
            View.beginWriting(id, name);
        }
    });

    Socket.on('end writing', function (id) {
        if (id != _user.id) {
            View.endWriting(id);
        }
    });

    View.on('show.roomselector', function () {
        Socket.getRoomList();
    });

    View.on('hashchange', function (id) {
        View.reset();
        Socket.join(id).then(function (room) {
            View.closeModal();
            View.setTitle(room.title, room.id);
            View.setHash(room.id);
        }, function () {
            View.showRoomSelector();
        });
    });

    View.on('submit.message', function (message) {
        Socket.sendMessage(message);
    });

    View.on('request.message', function () {
        Socket.requestMessage();
    });

    View.on('begin writing', function (name) {
        Socket.beginWriting(_user.id, name);
    });

    View.on('end writing', function () {
        Socket.endWriting(_user.id);
    });

    /// Run Client Program
    Client.run = function (path, user_id) {
        View.reset();
        View.showConnectingModal();

        Socket
            .connect(path, user_id)
            .then(function (user) {
                _user = user;
                View.setUser(user);
                return Socket.join(View.getHash());
            }, function () {
                console.error('Authorization Failed');
            }).then(function (room) {
                View.closeModal();
                View.setTitle(room.title, room.id);
                View.setHash(room.id);
            }, function () {
                View.closeModal().done(function () {
                    View.reset();
                    View.showRoomSelector();
                });
            });
    };

    $.getJSON('config/app.json').done(function (app) {
        $.getJSON('js/user.js.php').done(function (user) {
            _user_id = user.id;
            Client.run(app.path, user.id);
        });
    });
})(this.Client || (this.Client = {}));
