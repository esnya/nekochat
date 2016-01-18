angular.module('BeniimoOnlineSocket', ['btford.socket-io'])
.factory('socket', function ($location, socketFactory) {
    'use strict';

    var socket = io.connect();

    var factory = socketFactory({
        ioSocket: socket,
    });

    factory.on('hello', function (user) {
        console.log('hello', user);
        factory.user = user;
    });

    var dices = 0;
    factory.on('dice', function (eye, numbers) {
        if (eye == 6) {
            if ((dices += numbers.length) <= 10) {
                numbers.forEach(function (n) {
                    dice3d(eye, n, function () {
                        --dices;
                    });
                });
            } else {
                dices -= numbers.length;
            }
        }
    });

    return factory;
})
.factory('getIcon', function ($q, $timeout, socket) {
    var cache = {};
    var defers = {};
    var getIcon = function (id, defer) {
        if (!defer) {
            defer = $q.defer();
        }

        var icon = cache[id];
        var time = new Date;
        if (icon && icon.loading) {
            $timeout(function () {
                getIcon(id, defer);
            }, 500);
        } else if (icon && time - icon.time < 60 * 1000) {
            defer.resolve(cache[id]);
        } else {
            cache[id] = {
                loading: true
            };
            if (!defers[id]) {
                defers[id] = [];
            }
            defers[id].push(defer);
            socket.emit('get icon', id);
        }

        return defer.promise;
    };
    socket.on('icon', function (id, name, type, data) {
        cache[id] = {
            time: new Date,
            id: id,
            name: name,
            type: type,
            url: URL.createObjectURL(new File([data], name, { type: type }))
        };
        if (defers[id]) {
            var d = defers[id].slice();
            defers[id] = [];
            d.forEach(function (d) {
                d.resolve(cache[id]);
            });
        }
    });
    return getIcon;
})
.factory('getCharacter', function ($q, $http) {
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
                withCredentials: true,
            }).success(function (data) {
                character_cache[url].time = time;
                character_cache[url].data = data;
                character_cache[url].loading = false;
                if (data.icon) {
                    data.icon += '?' + Date.now();
                }
                if (data.portrait) {
                    data.portrait += '?' + Date.now();
                }
                d.resolve(data);
            }).error(function (data, status) {
                console.log('Failed to get character: ' + url);
                delete character_cache[url];
                d.reject(status);
            });
        }

        return d.promise;
    };

    return getCharacter;
});
