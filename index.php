<?php require_once(dirname(dirname(__FILE__)) . '/locale/locale.php') ?>
<!DOCTYPE html>
<html lang="ja" ng-app=BeniimoOnline ng-hashchange="hashchange($event)">
<head>
    <meta charset="UTF-8">
    <title><?= _('Beniimo Online') ?></title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <link rel="stylesheet" href="lib/angular-material/angular-material.css">
    <link rel="stylesheet" href="lib/cssdice/dice.css">
    <link rel="stylesheet" href="lib/cssdice/anim.css">
    <link rel="stylesheet" href="css/chat.css">
</head>
<body layout=row ng-controller=UI>
    <md-sidenav class="md-sidenav-left md-whiteframe-z2" layout=column md-component-id="left" md-is-locked-open="$media('gt-md')">
        <md-toolbar>
            <div class="md-toolbar-tools">
                <md-button aria-label="Close Left" ng-click="close('left')" hide-gt-md>
                    <ng-md-icon icon=close></ng-md-icon>
                </md-button>
                <h1><?= _('Beniimo Online'); ?></h1>
            </div>
        </md-toolbar>
        <md-content flex layout=column>
            <md-button ng-click="config($event)"><?= _('Global Settings') ?></md-button>
            <md-button href="#" ng-if=room.id><?= _('Leave Room') ?></md-button>
            <md-button target=_blank ng-href="log.php{{room.id}}" ng-if=room.id><?= _('Text Log') ?></md-button>
        </md-content>
    </md-sidenav>
    <div layout=column layout-fill role=main>
        <md-toolbar>
            <div class="md-toolbar-tools">
                <md-button aria-label="Toggle Left" ng-click="toggle('left')" hide-gt-md>
                    <ng-md-icon icon=menu></ng-md-icon>
                </md-button>
                <h1 ng-if=room.title>{{room.title}}</h1>
                <h1 ng-if=!room.title><?= _('Beniimo Online'); ?></h1>
            </div>
        </md-toolbar>
        <div ng-view flex layout=column></div>
    </div>

    <audio id=notice src="sound/nc32318.wav" preload=auto></audio>

    <script src="lib/jquery/jquery.js"></script>
    <script src="lib/socket.io-client/socket.io.js"></script>
    <script src="lib/angular/angular.js"></script>
    <script src="lib/angular-route/angular-route.js"></script>
    <script src="lib/angular-sanitize/angular-sanitize.js"></script>
    <script src="lib/angular-socket-io/socket.js"></script>
    <script src="lib/angular-animate/angular-animate.js"></script>
    <script src="lib/angular-aria/angular-aria.js"></script>
    <script src="lib/hammerjs/hammer.js"></script>
    <script src="lib/angular-material/angular-material.js"></script>
    <script src="lib/angular-material-icons/angular-material-icons.js"></script>
    <script src="lib/cssdice/dice.js"></script>
    <script src="js/jquery.cssanim.js"></script>
    <script src="js/socket.js"></script>
    <script src="js/chat-message.js"></script>
    <script src="js/chat-form.js"></script>
    <script src="js/chat-writing.js"></script>
    <script src="js/main.js"></script>
</body>
</html>
