import angular from 'angular';
import * as Icon from '../actions/IconActions';
import * as Input from '../actions/InputActions';
import * as Message from '../actions/MessageActions';
import * as MessageForm from '../actions/MessageFormActions';
import { AppStore } from './stores/AppStore';

angular.module('BeniimoOnlineChatForm', ['BeniimoOnlineSocket', require('angular-sanitize'), require('angular-route'), require('angular-material')])
.factory('SharedForm', function () {
    return {
        form: null
    };
})
.controller('ChatForm', function ($scope, $interval, $timeout, $mdDialog, socket, getCharacter, SharedForm) {
    $scope.forms = [];

    AppStore.subscribe(() => $timeout(() => {
        let {
            messageForm,
        } = AppStore.getState();

        if (messageForm.length == 0) {
            AppStore.dispatch(MessageForm.create({
                name: socket.user.name,
            }));
        }

        $scope.forms = messageForm;
    }));

    $scope.submit = function (form) {
        if (form.message) {
            AppStore.dispatch(Message.create({
                name: form.name,
                message: form.message,
                character_url: form.character_url,
                icon_id: form.icon_id,
            }));
            form.message = '';
            AppStore.dispatch(Input.end());
        }
    };
    $scope.setCharacterName = function (form) {
        getCharacter(form.activeForm.character_url).then(function (data) {
            if (data && data.name) {
                AppStore.dispatch(MessageForm.update({
                    ...form,
                    name: data.name,
                    icon_id: data.icon || data.portrait,
                }));
            }
        });
    };
    $scope.add = () => AppStore.dispatch(MessageForm.create());

    $scope.remove = form => AppStore.dispatch(MessageForm.remove(form.id));

    $scope.config = function (form) {
        SharedForm.form = Object.assign({}, form);
        $mdDialog.show({
            controller: 'MessageFormDialogController',
            templateUrl: 'template/setting.html'
        }).then(() => AppStore.dispatch(MessageForm.update(SharedForm.form)));
    };

    $scope.focus = function (form) {
        AppStore.dispatch(Input.begin({
            name: form.name,
            message: form.message,
        }));
    };
    $scope.change = function (form) {
        AppStore.dispatch(Input.begin({
            name: form.name,
            message: form.message,
        }));
    };
    $scope.blur = function (form) {
        AppStore.dispatch(Input.end());
    };
    $scope.keydown = function ($event, form) {
        if ($event.keyCode == 13 && !$event.shiftKey) {
            $event.preventDefault();
            $scope.submit(form);
        }
    };
})
.controller('MessageFormDialogController', function ($scope, $mdDialog, $timeout, socket, getCharacter, SharedForm) {
    AppStore.subscribe(() => $timeout(() => {
        let {
            iconList,
        } = AppStore.getState();

        $scope.icons = iconList.map(icon => Object.assign({
            url: `/icon/${icon.id}`,
        }, icon));
    }));

    $scope.form = SharedForm.form;

    $scope.close = function () {
        $mdDialog.hide();
    };

    $scope.setCharacterName = function () {
        getCharacter($scope.form.character_url).then(function (data) {
            if (data && data.name) {
                $scope.form.name = data.name;
                $scope.form.defaultIcon = data.icon || data.portrait;
            }
        });
    };

    $scope.upload = function () {
        var i = document.getElementById('upload-icon');
        if (i.files.length == 1) {
            let file = i.files[0];
            
            AppStore.dispatch(Icon.create({
                name: file.name,
                mime: file.type,
                file,
            }));
        };
    };

    AppStore.dispatch(Icon.fetch());
});
