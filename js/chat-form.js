angular.module('BeniimoOnlineChatForm', ['BeniimoOnlineSocket', 'ngSanitize', 'ngRoute', 'ngMaterial'])
.factory('SharedForm', function () {
    return {
        form: null
    };
})
.controller('ChatForm', function ($scope, $interval, $mdDialog, socket, getCharacter, SharedForm) {
    'use strict';

    var saveForms = function () {
        if (localStorage && localStorage.setItem) {
            localStorage.setItem($scope.room.id + '/forms', JSON.stringify($scope.forms.map(function (form) {
                return {
                    id: form.id,
                    name: form.name,
                    character_url: form.character_url,
                    icon_id: form.icon_id
                };
            })));
        }
    };

    $scope.forms = [];
    $scope.submit = function (form) {
        if (form.message) {
            form.previousMessage = form.message;
            socket.emit('add message', {
                name: form.name,
                message: form.message,
                character_url: form.character_url,
                icon_id: form.icon
            });
            form.message = '';

            $scope.change(form);
        }
    };
    $scope.setCharacterName = function (form) {
        getCharacter(form.activeForm.character_url).then(function (data) {
            if (data && data.name) {
                form.name = data.name;
                form.icon = data.icon || data.portrait;
            }
            saveForms();
        });
    };
    $scope.add = function () {
        var first = $scope.forms[0];
        var form = {
            name: first.name,
            character_url: first.character_url
        };
        form.id = $scope.forms.push(form) - 1;
        saveForms();
    };
    $scope.remove = function (form) {
        form.removed = true;
    };
    $scope.config = function (form) {
        SharedForm.form = form;
        $mdDialog.show({
            controller: 'MessageFormDialogController',
            templateUrl: 'template/setting.php'
        }).then(function () {
            saveForms();
        });
    };

    var writing_timer;
    $scope.focus = function (form) {
        writing_timer = $interval(function () {
            socket.emit('writing_message', form.message ? {
                name: form.name,
                message: form.message,
                character_url: form.character_url,
                icon_id: form.icon
            } : null);
        }, 500);
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
        if (writing_timer) {
            $interval.cancel(writing_timer);
        }
        if (form.writing) {
            form.writing = false;
            socket.emit('end writing');
        }
    };
    $scope.keydown = function ($event, form) {
        if ($event.keyCode == 13 && !$event.shiftKey) {
            $event.preventDefault();
            $scope.submit(form);
        }
    };

    var nameFlag;
    socket.on('join ok', function () {
        $scope.forms = (localStorage && JSON.parse(localStorage.getItem($scope.room.id + '/forms'))) || [{
            name: socket.user.name
        }];
        nameFlag = true;
    });
})
.controller('MessageFormDialogController', function ($scope, $mdDialog, socket, getCharacter, SharedForm) {
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
            $scope.uploading = true;
            var file = i.files[0];
            socket.emit('add icon', file.name, file.type, file);
        };
    };

    socket.on('icon added', function () {
        socket.emit('get icons');
        $scope.uploading = false;
    });
    socket.on('adding icon failed', function () {
        $scope.uploading = false;
    });
    socket.on('icons', function (icons) {
        $scope.icons = icons;
        icons.forEach(function (icon) {
            icon.url = URL.createObjectURL(new File([icon.data], icon.name, {type: icon.type}));
        });
    });

    socket.emit('get icons');
});
