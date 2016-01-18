import $ from 'jquery';
import { makeColor } from './color';

angular.module('BeniimoOnlineChatMessage', ['BeniimoOnlineSocket', 'ngSanitize', 'ngRoute', 'ngMaterial'])
.filter('nl2br', function ($sce) {
    return function (str) {
        return $sce.trustAsHtml(str.replace(/\r\n|\n|\r/, '<br>'));
    }
})
.controller('ChatMessage', function ($scope, $timeout, $interval, $mdToast, socket, getCharacter, getIcon, notice) {
    'use strict';
    $scope.messages = [];

    //var obs = new MutationObserver(function (mutations) {
    //    var list = $('#messages').parent();
    //    var parent = list.closest('[md-scroll-y]');

    //    setTimeout(function () {
    //        mutations.filter(function (mutation) {
    //            return mutation.type == 'childList';
    //        }).map(function (mutation) {
    //            return mutation.target.firstElementChild;
    //        }).forEach(function (target) {
    //            parent.scrollTop(parent.scrollTop() + $(target).height() + 28);
    //        });
    //    }, 50);
    //});
    //$scope.$on('$destroy', function () {
    //    obs.disconnect();
    //});

    //obs.observe(document.getElementById('messages'), {
    //    childList: true
    //});

    $scope.leave = function () {
        socket.emit('leave');
        $scope.room = null;
    };


    $('#messages').closest('[md-scroll-y]').on('scroll', function () {
        var top = $('#messages').closest('[md-scroll-y]').scrollTop();
        var height = $('#messages').parent().height();
        var parentHeight = $('#messages').closest('[md-scroll-y]').height();
        //console.log(top, height, parentHeight, top + parentHeight);
        if (top + parentHeight >= height) {
        //if ($('#messages').closest('[md-scroll-y]').scrollTop() == 0) {
            socket.emit('message request');
        }
    });

    var logLoader;
    socket.on('join ok', function (room) {
        $scope.room = room;
        $scope.messages = [];
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

    var writing_timers = {};
    $scope.writing_messages = {};
    socket.on('writing_message', function (user, message) {
        if (user.id != socket.user.id) {
            $scope.writing_messages[user.id] = message;
            var timer = writing_timers[user.id];
            writing_timers[user.id] = $timeout(function () {
                $scope.writing_messages[user.id] = null;
            }, 30 * 1000);
            if (timer) $timeout.cancel(timer);
        }
    });

    var maxId = -1;
    socket.on('add message', function (message) {
        if (!$scope.room) return;

        message.isHeader = true;

        //var above, below;
        //if (len > 0) {
        //    above = messages[insert - 1];
        //}
        //if (insert < length) {
        //    below = messages
        //}
        //for (var i = message.id - 1; i >= 0; --i) {
        //    if (i in $scope.messages) {
        //        above = $scope.messages[i];
        //        break;
        //    }
        //}
        //for (var i = message.id + 1; i <= maxId; ++i) {
        //    if (i in $scope.messages) {
        //        below = $scope.messages[i];
        //        break;
        //    }
        //}

        //if (above && above.user_id == message.user_id 
        //        && above.name == message.name
        //        && above.icon_id == message.icon_id) {
        //    message.isHeader = false;
        //}
        //if (below) {
        //    if (message.isHeader && below.user_id == message.user_id 
        //            && below.name == message.name
        //            && below.icon_id == message.icon_id) {
        //        below.isHeader = false;
        //    }
        //    if (!below.isHeader && (below.user_id != message.user_id
        //                || below.name != message.name
        //                || below.icon_id != message.icon_id
        //                )) {
        //        below.isHeader = true;
        //    }
        //}

        if (message.icon_id) {
            message.overrideIcon = true;
            getIcon(message.icon_id).then(function (icon) {
                message.icon = icon.url;
            });
        }

        if (message.character_url) {
            getCharacter(message.character_url).then(function (data, async) {
                if (!message.overrideIcon) {
                    var icon = data.icon || data.portrait;
                    if (icon) {
                        message.icon = (new URL(icon, message.character_url)).toString();
                    }
                }

                if (data.color) {
                    message.color = data.color;
                }

                message.url = (new URL(data.url, message.character_url)).toString();
            });
        }

        message.color = makeColor(message.name + message.user_id);

        $scope.messages.push(message);

        notice.play();
    });
});
