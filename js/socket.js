angular.module('BeniimoOnlineSocket', ['btford.socket-io'])
.factory('socket', function ($location, socketFactory) {
    'use strict';

    var socket = io.connect('http://' + location.host,
            {
                path: '/chat/socket.io',
                transports: ['websocket'],
                reconnectionDelay: 0,
                timeout: 3000
            });

    var factory = socketFactory({
        ioSocket: socket
    });

    factory.on('hello', function (user) {
        factory.user = user;
    });

    var dices = 0;
    factory.on('dice', function (eye, numbers) {
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

    return factory;
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
                delete character_cache[url];
                d.reject(status);
            });
        }

        return d.promise;
    };

    return getCharacter;
});
