import angular from 'angular';
import $ from 'jquery';
import * as Message from '../actions/MessageActions';
import * as Room from '../actions/RoomActions';
import { makeColor } from './color';
import { AppStore } from './stores/AppStore';

angular.module('BeniimoOnlineChatMessage', ['BeniimoOnlineSocket', require('angular-sanitize'), require('angular-route'), require('angular-material')])
.filter('nl2br', function ($sce) {
    return function (str) {
        return $sce.trustAsHtml(str.replace(/\r\n|\n|\r/, '<br>'));
    }
})
.controller('ChatMessage', function ($scope, $timeout, $interval, $mdToast, socket, getCharacter, getIcon, notice) {
    let prevLength = 0;
    let minId;

    $scope.messages = [];

    AppStore.subscribe(() => $timeout(() => {
        let {
            input,
            messageList,
        } = AppStore.getState();
        
        $scope.writing_messages = input;

        if (prevLength == messageList.length) return;
        prevLength = messageList.length;

        notice.play();

        let list = messageList.map(message => {
            message = Object.assign({}, message);

            if (!minId || message.id < minId)  minId = message.id;

            message.isHeader = true;

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

            return message;
        });

        list.sort((a, b) => a.id - b.id);

        $scope.messages = list;
    }));

    $scope.leave = () => AppStore.dispatch(Room.leave());

    $('#messages').closest('[md-scroll-y]').on('scroll', function () {
        var top = $('#messages').closest('[md-scroll-y]').scrollTop();
        var height = $('#messages').parent().height();
        var parentHeight = $('#messages').closest('[md-scroll-y]').height();
        if (top + parentHeight >= height) {
            AppStore.dispatch(Message.fetch(minId));
        }
    });

    AppStore.dispatch(Message.fetch());
});
