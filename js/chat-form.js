angular.module('BeniimoOnlineChatForm', ['BeniimoOnlineSocket', 'ngSanitize', 'ngRoute', 'ngMaterial']).controller('ChatForm', function ($scope, $mdDialog, socket, getCharacter) {
    'use strict';

    $scope.forms = [];
    $scope.submit = function (form) {
        if (form.message) {
            form.previousMessage = form.message;
            socket.emit('add message', {
                name: form.name,
                message: form.message,
                character_url: form.character_url
            });
            form.message = '';

            $scope.change(form);
        }
    };
    $scope.setCharacterName = function (form) {
        getCharacter(form.activeForm.character_url).then(function (data) {
            if (data && data.name) {
                form.name = data.name;
            }
        });
    };
    $scope.add = function () {
        var first = $scope.forms[0];
        var form = {
            name: first.name,
            character_url: first.character_url
        };
        form.id = $scope.forms.push(form) - 1;
    };
    $scope.remove = function (form) {
        form.removed = true;
    };
    $scope.config = function (form) {
        $mdDialog.show({
            controller: function ($scope, $mdDialog) {
                $scope.form = form;
                $scope.close = function () {
                    $mdDialog.hide();
                };

                $scope.setCharacterName = function () {
                    getCharacter($scope.form.character_url).then(function (data) {
                        if (data && data.name) {
                            $scope.form.name = data.name;
                        }
                    });
                };
            },
            templateUrl: 'template/setting.php'
        });
    };
    $scope.focus = function (form) {
        if (!form.writing && form.message) {
            form.writing = true;
            socket.emit('begin writing', form.name);
        }
    };
    $scope.change = function (form) {
        if (form.writing) {
            if (!form.message) {
                form.writing = false;
                socket.emit('end writing');
            }
        } else {
            if (form.message) {
                form.writing = true;
                socket.emit('begin writing', form.name);
            }
        }
    };
    $scope.blur = function (form) {
        if (form.writing) {
            form.writing = false;
            socket.emit('end writing');
        }
    };

    var nameFlag;
    socket.on('join ok', function () {
        $scope.forms = [{
            name: socket.user.name
        }];
        nameFlag = true;
    });

    socket.on('add message', function (message) {
        if (message.user_id == socket.user.id && nameFlag) {
            nameFlag = false;
            $scope.forms[0].name = message.name;
            $scope.forms[0].character_url = message.character_url;
        }
    });
});
