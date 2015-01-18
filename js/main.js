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
(function () {
    'use strict';
    angular
        .module('BeniimoOnline', ['ngSanitize', 'btford.socket-io', 'ngMdIcons', 'ngMaterial', 'ngRoute', 'BeniimoOnlineChatMessage', 'BeniimoOnlineChatForm', 'BeniimoOnlineChatWriting'])
        .factory("Room", function() {
            return {id: null, title: null};
        })
        .filter('reverse', function() {
            return function(items) {
                return items.slice().reverse();
            };
        })
        .filter('toArray', function () {
            return function (obj) {
                if (!(obj instanceof Object)) {
                    return obj;
                }

                return Object.keys(obj).map(function (key) {
                    return Object.defineProperty(obj[key], '$key', {__proto__: null, value: key});
                });
            }
        })
        .factory('notice', function () {
            var notice = document.getElementById('notice');
            return {
                play: function () {
                    notice.play();
                }
            }
        })
        .directive('onFinishRender', function ($timeout) {
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
        })
        .config(function ($routeProvider) {
            $routeProvider.
                when('/:roomId', {
                    templateUrl: 'template/chat.php',
                    controller: 'Chat'
                })
            .otherwise({
                templateUrl: 'template/lobby.php',
                controller: 'Lobby'
            });

        })
        .config(function ($mdThemingProvider) {
            $mdThemingProvider.theme('default')
                .primaryColor('amber')
                .accentColor('indigo');
        })
        .controller('UI', function ($scope, $mdSidenav, $mdDialog, Room) {
            $scope.room = Room;

            $scope.toggle = function (id) {
                console.log(id);
                $mdSidenav(id).toggle();
            };
            $scope.close = function (id) {
                $mdSidenav(id).close();
            };
            $scope.config = function (e) {
                $mdDialog.show({
                    controller: function ($scope) {
                        $('audio').each(function () {
                            $scope.volume = Math.round(this.volume * 100);
                        });
                        $scope.setVolume = function () {
                            $('audio').each(function () {
                                this.volume = $scope.volume / 100;
                            });
                        };
                    },
                    templateUrl: 'template/global-config.php',
                    targetEvent: e
                });
            };
        })
        .controller('Lobby', function ($scope, $q, $location, $mdDialog, socket, Room) {
            $scope.create = function () {
                var title = $scope.create_title;
                $scope.create_title = '';
                if (title) {
                    socket.emit('create room', title);
                }
            };
            $scope.remove = function (room, e) {
                var confirm = $mdDialog.confirm()
                    .title('Remove OK?')
                    .content(room.id + ' ' + room.title)
                    .ariaLabel('Remove OK?')
                    .ok('Remove')
                    .cancel('Cancel')
                    .targetEvent(e);
                $mdDialog.show(confirm).then(function () {
                    socket.emit('remove room', room.id);
                });
            };

            var history = $q.defer();
            var myroom = $q.defer();

            socket.on('room history', function (history) {
                $scope.history = history;
            });
            socket.on('room list', function (room_list) {
                $scope.myroom = room_list;
            });
            socket.on('connected', function () {
                console.log('connected');
            });
            socket.on('join ok', function (room) {
                $location.path('/' + room.id.substr(1));
            });
            socket.on('room removed', function () {
                socket.emit('room history');
                socket.emit('room list');
            });

            socket.emit('leave');
            Room.id = null;
            Room.title = null;

            socket.emit('room history');
            socket.emit('room list');
        })
        .controller('Chat', function ($scope, $routeParams, socket, Room) {
            socket.on('join ok', function (room) {
                Room.id = room.id;
                Room.title = room.title;
            });

            socket.emit('join request', '#' + $routeParams.roomId);
        });
})();
