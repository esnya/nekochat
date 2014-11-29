(function ($) {
    $.fn.modal = function (func) {
        switch (func) {
            case 'show':
                $('<a>').addClass('modal-trigger').attr('href', '#' + this.attr('id')).hide().leanModal().appendTo(document.body).trigger('click').remove();
                break;
            case 'hide':
                this.find('.modal_close').trigger('click');
                break;
        }
        return this;
    };
})(jQuery);

$(function () {
    'use strict';

    var showConnectingModal = function () {
        $('[href="#modal-connecting"]').trigger('click');
    };
    showConnectingModal();
    var connectingModalTimer = setInterval(function () {
        if ($('#modal-connecting').css('display') == 'none') {
            showConnectingModal();
        }
    }, 1000);
    var closeConnectingModal = function () {
        clearInterval(connectingModalTimer);
        $('#lean_overlay').trigger('click');
    };

    $.getJSON('js/user.js.php').done(function (user) {
        var room;

        View.MessageForm.setUser(user);

        $.getJSON('config/app.json').done(function (app) {
            var socket = io.connect('http://' + location.hostname, { path: app.path, transports: ['websocket'] });
            socket.on('connect', function () {
                console.log('Connected');
                socket.emit('auth request', user);
            });

            socket.on('auth ok', function () {
                console.log('Auth OK');

                var room_id = location.hash;

                socket.emit('join request', room_id);

                socket.on('join failed', function () {
                    closeConnectingModal();
                    console.log('Join Failed');

                    socket.emit('room list');

                    setTimeout(function () {
                        $('#modal-roomselect').modal('show');
                    }, 500);
                });

                socket.on('join ok', function (data) {
                    room = data;
                    console.log('Join OK', room);
                    closeConnectingModal();
                    $('#modal-roomselect').modal('hide');
                    $('.brand-logo').text(room.title).attr('href', room.id);
                    location.hash = room.id;
                });

                socket.on('joined', function (data) {
                    console.log('Joined: ', data.name);
                    View.Message.addUser(data);
                });

                socket.on('message', function (data) {
                    View.Message.add(data);
                });

                $('#form-createroom-create').click(function () {
                    var title = $('#form-createroom-title').val();
                    var game = $('#form-createroom-game').val();
                    socket.emit('create room', title, game);
                });

                socket.on('writing', function (user_id, name) {
                    if (user.id != user_id) {
                        View.Message.writing(user_id, name);
                    }
                });

                $(window).bind('hashchange', function () {
                    if (!room || room.id != location.hash) {
                        View.Message.empty();
                        socket.emit('join request', location.hash);
                    }
                });
            });

            socket.on('room list', function (rooms) {
                View.RoomList.set(rooms);
            });

            $('[href=#roomlist]').click(function (event) {
                socket.emit('room list');
            });

            $('[data-action=roomselect]').click(function (event) {
                //event.preventDefault();
                socket.emit('room list');
                $('#modal-roomselect').modal('show');
            });

            View.MessageForm.onsubmit = function (name, message, character_url) {
                socket.emit('message', name, message, character_url);
            };

            View.MessageForm.onwriting = function (name) {
                socket.emit('writing', name);
            }
        });
    });
});
