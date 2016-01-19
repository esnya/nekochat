import * as Room_ from '../actions/RoomActions';
import * as RoomList from '../actions/RoomListActions';
import { makeColor } from './color';
import { AppStore } from './stores/AppStore';

(function () {
    'use strict';
    angular
        .module('BeniimoOnline', [require('angular-sanitize'), require('angular-material-icons'), require('angular-material'), require('angular-route'), 'BeniimoOnlineChatMessage', 'BeniimoOnlineChatForm', 'BeniimoOnlineChatWriting'])
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
                    templateUrl: 'template/chat.html',
                    controller: 'Chat'
                })
            .otherwise({
                templateUrl: 'template/lobby.html',
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
                    templateUrl: 'template/global-config.html',
                    targetEvent: e
                });
            };
        })
        .controller('Lobby', function ($scope, $timeout, $q, $location, $mdDialog, socket, Room) {
            AppStore.subscribe(() => $timeout(() => {
                let {
                    roomList,
                } = AppStore.getState();
                
                $scope.history = roomList.history;
                $scope.myroom = roomList.rooms;
            }));
    
            AppStore.dispatch(Room_.leave());
            AppStore.dispatch(RoomList.fetch());
            $scope.create = function () {
                var title = $scope.create_title;
                $scope.create_title = '';
                if (title) {
                    AppStore.dispatch(Room_.create({title}));
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
                    AppStore.dispatch(Room_.remove(room.id));
                });
            };
            $scope.join = function(room) {
                location.hash = '#/' + room.id.substr(1);
            };

            socket.emit('leave');
            Room.id = null;
            Room.title = null;
        })
        .controller('Chat', function ($scope, $timeout, $routeParams, socket, Room) {
            let joined;
            AppStore.subscribe(() => $timeout(() => {
                let {
                    room,
                } = AppStore.getState();

                $scope.room = room;

                if (room) {
                    joined = room.id;
                    Room.joined = true;
                    Room.id = room.id;
                    Room.title = room.title;
                    $scope.users = room.users;   
                } else {
                    Room.joined = false;
                }
            }));
            let roomId = $routeParams.roomId;
            if (roomId && joined != roomId) {
                AppStore.dispatch(Room_.join('#' + roomId));
            }
        });
})();
