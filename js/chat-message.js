angular.module('BeniimoOnlineChatMessage', ['BeniimoOnlineSocket', 'ngSanitize', 'ngRoute', 'ngMaterial']).controller('ChatMessage', function ($scope, $timeout, $interval, $mdToast, socket, getCharacter, notice) {
    'use strict';
    $scope.messages = {};

    $scope.messageScroll = function (force) {
        var list = $('#messages').parent();
        var parent = list.closest('[md-scroll-y]');
        var item = $('#messages > .message:last-child md-item-content');

        if (force || parent.scrollTop() + parent.height() + item.height() >= list.height()) {
            parent.scrollTop(parent.scrollTop() + 10000);
        }
    };
    $scope.leave = function () {
        socket.emit('leave');
        $scope.room = null;
    };

    socket.on('join ok', function (room) {
        $scope.room = room;
        $scope.messages = {};
        $timeout(function () {
            $scope.messageScroll(true);
        }, 1000);
    });

    socket.on('user joined', function (user) {
        $mdToast.show($mdToast
                .simple()
                .position('top right')
                .content(user.name + '@' + user.id + ' joined'));
    });
    socket.on('user leaved', function (user) {
        $mdToast.show($mdToast
                .simple()
                .position('top right')
                .content(user.name + '@' + user.id + ' leaved'));
    });

    var maxId = -1;
    socket.on('add message', function (message) {
        if (!$scope.room) return;

        maxId = Math.max(maxId, message.id);

        message.isHeader = true;

        var above, below;
        for (var i = message.id - 1; i >= 0; --i) {
            if (i in $scope.messages) {
                above = $scope.messages[i];
                break;
            }
        }
        for (var i = message.id + 1; i <= maxId; ++i) {
            if (i in $scope.messages) {
                below = $scope.messages[i];
                break;
            }
        }

        if (above && above.user_id == message.user_id 
                && above.name == message.name) {
            message.isHeader = false;
        }
        if (below) {
            if (message.isHeader && below.user_id == message.user_id 
                    && below.name == message.name) {
                below.isHeader = false;
            }
            if (!below.isHeader && (below.user_id != message.user_id
                        || below.name != message.name)) {
                below.isHeader = true;
            }
        }

        if (message.character_url) {
            getCharacter(message.character_url).then(function (data, async) {
                var icon = data.icon || data.portrait;
                if (icon) {
                    message.icon = icon;
                }

                if (data.color) {
                    message.color = data.color;
                }

                message.url = data.url;
            });
        }

        message.color = makeColor(message.name + message.user_id);

        $scope.messages[message.id] = message;

        notice.play();
    });

    var logLoader = $interval(function () {
        if ($('#messages').closest('[md-scroll-y]').scrollTop() == 0) {
            socket.emit('message request');
        }
    }, 1000);
});
