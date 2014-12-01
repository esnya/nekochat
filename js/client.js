(function (Client) {
    var _user_id;
    var _user;

    Socket.on('disconnect', function () {
        View.reset();
        View.showConnectingModal();
    });

    Socket.on('join ok', function (room) {
        View.setTitle(room.title, room.id);
        View.setHash(room.id);
        View.closeModal();
    });

    Socket.on('join failed', function (room) {
        View.showRoomSelector();
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

    Socket.on('dice', function (eye, numbers) {
        if (eye == 6 && numbers.length < 10) {
            numbers.forEach(function (n) {
                dice6(n);
            });
        }
    });

    View.on('show.roomselector', function () {
        Socket.getRoomList();
    });

    View.on('hashchange', function (id) {
        View.reset();
        Socket.join(id);
    });

    View.on('submit.message', function (message) {
        Socket.sendMessage(message);
    });

    View.on('request.message', function () {
        Socket.requestMessage();
    });

    View.on('create.room', function (title) {
        Socket.createRoom(title);
    });

    View.on('begin writing', function (name) {
        Socket.beginWriting(_user.id, name);
    });

    View.on('end writing', function () {
        Socket.endWriting(_user.id);
    });

    /// Run Client Program
    Client.run = function (path, user) {
        View.setUser(user);
        View.reset();
        View.showConnectingModal();

        Socket.connect(path, user.id);
    };

    $.getJSON('config/app.json').done(function (app) {
        $.getJSON('js/user.js.php').done(function (user) {
            _user = user;
            _user_id = user.id;
            Client.run(app.path, user);
        });
    });
})(this.Client || (this.Client = {}));
