angular.module('BeniimoOnlineChatWriting', ['BeniimoOnlineSocket', 'ngSanitize', 'ngMaterial'])
.controller('ChatWriting', function ($scope, socket) {
    $scope.writings = {};
    socket.on('begin writing', function (user_id, name) {
        $scope.writings[user_id] = {
            user_id: user_id,
            name: name
        };
    });
    socket.on('end writing', function (user_id) {
        delete $scope.writings[user_id];
    });
});
