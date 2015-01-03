(function () {
    'use strict';

    var makeColor = function (data) {
        var hash = Array.prototype.reduce.call(data + data, function (sum, c, i) {
            return (sum * 31 + c.charCodeAt(0)) & 0xffffff;
        }, 0);

        var color = [];
        for (var i = 0; i < 3; ++i) {
            color.push(hash & 0xff);
            hash >>= 8;
        }
        color.push(1);

        return 'rgba(' + color.join(",") + ')';
    };

    angular
        .module('BeniimoOnline', ['btford.socket-io'])
        .factory('socket', function (socketFactory) {
            return socketFactory({
                ioSocket: io.connect('http://' + location.host,
                                  {
                                      path: '/chat/socket.io',
                                      transports: ['websocket'],
                                      reconnectionDelay: 0,
                                      timeout: 1000
                                  })
            });
        }).factory('getCharacter', function ($q, $http) {
            var character_cache = {};

            var getCharacter = function (url, d) {
                if (!d) {
                    d = $q.defer();
                }

                var character = character_cache[url];
                var time = new Date;
                if (character && character.loading) {
                    setTimeout(function () {
                        getCharacter(url, d);
                    }, 500);
                } else if (character && time - character.time < 60 * 1000) {
                    d.resolve(character.data);
                } else {
                    character_cache[url] = {
                        loading: true
                    };
                    $http({
                        method: 'get',
                        url: url,
                    }).success(function (data) {
                        character_cache[url].time = time;
                        character_cache[url].data = data;
                        character_cache[url].loading = false;
                        d.resolve(data);
                    }).error(function (data, status) {
                        delete character_cache[url];
                        d.reject(status);
                    });
                }

                return d.promise;
            };

            return getCharacter;
        }).filter('reverse', function() {
            return function(items) {
                return items.slice().reverse();
            };
        }).directive('onFinishRender', function ($timeout) {
            return {
                restrict: 'A',
                link: function (scope, element, attr) {
                    if (scope.$last === true) {
                        $timeout(function () {
                            scope.$eval(attr.onFinishRender);
                        });
                    }
                }
            }
        }).controller('BeniimoOnline', function ($scope, $http, $interval, socket, getCharacter) {
            var maxId = -1;
            $scope.messages = {};
            $scope.writings = {};
            $scope.forms = [];

            $scope.submitMessage = function (form) {
                if (form.message) {
                    form.previousMessage = form.message;
                    socket.emit('add message', {
                        name: form.name,
                        message: form.message,
                        character_url: form.character_url
                    });
                    form.message = '';

                    $scope.formChange(form);
                }
            };

            $scope.messageSettingModal = function (form) {
                $scope.activeForm = form;
                $('<a class=modal-trigger href=#modal-message-setting>')
                    .hide()
                    .appendTo('body')
                    .leanModal()
                    .trigger('click')
                    .remove();
                $('#modal-message-setting input').trigger('focus');
            };

            $scope.setCharacterName = function () {
                getCharacter($scope.activeForm.character_url).then(function (data) {
                    if (data && data.name) {
                        $scope.activeForm.name = data.name;
                    }
                });
            };

            $scope.addForm = function () {
                var first = $scope.forms[0];
                $scope.forms.push({
                    name: first.name,
                    character_url: first.character_url
                });
            };

            $scope.removeForm = function (index) {
                if (index > 0) {
                    $scope.forms = $scope.forms.slice(0, index).concat($scope.forms.slice(index + 1));
                }
            };

            $scope.messageScroll = function (forceScroll) {
                var item = document.querySelector('#message-list > .message:last-child');
                if (item) {
                    var main = document.querySelector('main');
                    var top = item.offsetTop + item.offsetHeight - main.offsetTop - main.offsetHeight + 16;
                    if (forceScroll || top - main.scrollTop <= item.offsetHeight * 2) {
                        //main.scrollTop = item.offsetTop + item.offsetHeight - main.offsetTop - main.offsetHeight + 16;
                        main.scrollTop += 1000;
                    }
                }
            };

            $scope.setVolume = function () {
                document.getElementById('alert').volume = document.getElementById('form-global-setting-volume').value / 100;
            };
            $scope.setVolume();

            $scope.leave = function () {
                socket.emit('leave');
                $scope.room = null;
                if (defaultTitle) {
                    document.title = defaultTitle
                }
                location.hash = '#';
            };

            $scope.formFocus = function (form) {
                if (!form.writing && form.message) {
                    form.writing = true;
                    socket.emit('begin writing', form.name);
                }
            };
            $scope.formChange = function (form) {
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
            $scope.formBlur = function (form) {
                if (form.writing) {
                    form.writing = false;
                    socket.emit('end writing');
                }
            };

            $scope.createRoom = function () {
                var title = $scope.create_title;
                console.log(title);
                if (title) {
                    $scope.create_title = '';
                    socket.emit('create room', title);
                }
            };

            $(window).bind('hashchange', function () {
                socket.emit('join request', location.hash);
            });

            var logLoader = $interval(function () {
                if ($('main').scrollTop() == 0) {
                    socket.emit('message request');
                }
            }, 1000);

            socket.on('connect', function () {
                console.log('connected');
                $scope.connected = true;
            });
            socket.on('disconnect', function () {
                console.log('disconnected');
                $scope.connected = false;
            });
            
            var user;
            socket.on('hello', function (user_) {
                user = user_;
                socket.emit('join request', location.hash);
            });

            var defaultTitle;
            socket.on('join ok', function (room) {
                console.log('join ok');
                $scope.room = room;
                $scope.messages = {};

                if (!defaultTitle) {
                    defaultTitle = document.title;
                }
                document.title = room.title + ' - ' + defaultTitle;

                $scope.forms = [{
                    name: user.name,
                }];
                $scope.activeForm = null;
                setTimeout(function () {
                    $scope.messageScroll(true);
                }, 1500);
            });

            socket.on('join failed', function () {
                socket.emit('room list');
                socket.emit('room history');
            });

            socket.on('room list', function (rooms) {
                $scope.rooms = rooms;
            });
            socket.on('room history', function (rooms) {
                $scope.history = rooms;
            });

            socket.on('user joined', function (user) {
                toast(user.name + '@' + user.id + ' joined', 1000);
            });
            socket.on('user leaved', function (user) {
                toast(user.name + '@' + user.id + ' leaved', 1000);
            });

            socket.on('begin writing', function (user_id, name) {
                $scope.writings[user_id] = {user_id: user_id, name: name};
            });
            socket.on('end writing', function (user_id) {
                delete $scope.writings[user_id];
            });

            var dices = 0;
            socket.on('dice', function (eye, numbers) {
                if (eye == 6) {
                    if ((dices += numbers.length) <= 10) {
                        numbers.forEach(function (n) {
                            dice6(n, function () {
                                --dices;
                            });
                        });
                    } else {
                        dices -= numbers.length;
                    }
                }
            });

            socket.on('add message', function (message) {
                if (!$scope.room) return;

                maxId = Math.max(maxId, message.id);

                message.isHeader = true;

                if (message.user_id == user.id && !$scope.room.nameLoaded) {
                    $scope.room.nameLoaded = true;
                    $scope.forms[0].name = message.name;
                    $scope.forms[0].character_url = message.character_url;
                }

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

                var main = $('main');
                var atBottom = main.scrollTop() + main.height() + 64 * 4>= $('#message-list').height();

                if (message.character_url) {
                    getCharacter(message.character_url).then(function (data, async) {
                        var icon = data.icon || data.portrait;
                        if (icon) {
                            message.icon = icon + '?' + (new Date).getTime();
                        }

                        if (data.color) {
                            message.color = data.color;
                        }

                        message.url = data.url;
                    });
                }

                message.color = makeColor(message.name + message.user_id);

                $scope.messages[message.id] = message;

                document.querySelector('#alert').play();
            });
        });
})();
