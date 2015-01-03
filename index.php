<?php require_once(dirname(dirname(__FILE__)) . '/locale/locale.php') ?>
<!DOCTYPE html>
<html lang="ja" ng-app=BeniimoOnline ng-hashchange="hashchange($event)">
<head>
    <meta charset="UTF-8">
    <title><?= _('Beniimo Online') ?></title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <link rel="stylesheet" href="lib/materialize/css/materialize.css">
    <link rel="stylesheet" href="lib/cssdice/dice.css">
    <link rel="stylesheet" href="lib/cssdice/anim.css">
    <link rel="stylesheet" href="css/chat.css">
</head>
<body class="flex flex-column" ontouchmove="event.preventDefault()" ng-controller=BeniimoOnline>
    <nav class="amber darken-1">
        <!-- .container -->
        <div class="container">
            <!-- .nav-wrapper -->
            <div class="nav-wrapper">
                <a ng-href="{{room.id}}" class="brand-logo" ng-show=room ng-bind="room.title"><?= _('Beniimo Online') ?></a>
                <a href="#" class="brand-logo" ng-hide=room><?= _('Beniimo Online') ?></a>
                <ul id="nav-mobile" class="right side-nav">
                    <li><a href="#" onclick="return false" ng-click="leave()"><?= _('Leave Room') ?></a></li>
                    <li><a href=#modal-global-setting class="modal-trigger"><?= _('Global Settings') ?></a></li>
                    <li ng-show=room><a href="log.php{{room.id}}" target=_blank class="open-log"><?= _('Text Log') ?></a></li>
                </ul>
                <a class="button-collapse" href="#" data-activates="nav-mobile"><i class="mdi-navigation-menu"></i></a>
            </div>
            <!-- /.nav-wrapper -->
        </div>
        <!-- /.container -->
    </nav>

    <div ng-hide="connected" class=fill>
        <div class="preloader-wrapper big active">
            <div class="spinner-layer spinner-blue">
                <div class="circle-clipper left">
                    <div class="circle"></div>
                    </div><div class="gap-patch">
                    <div class="circle"></div>
                    </div><div class="circle-clipper right">
                    <div class="circle"></div>
                </div>
            </div>

            <div class="spinner-layer spinner-red">
                <div class="circle-clipper left">
                    <div class="circle"></div>
                    </div><div class="gap-patch">
                    <div class="circle"></div>
                    </div><div class="circle-clipper right">
                    <div class="circle"></div>
                </div>
            </div>

            <div class="spinner-layer spinner-yellow">
                <div class="circle-clipper left">
                    <div class="circle"></div>
                    </div><div class="gap-patch">
                    <div class="circle"></div>
                    </div><div class="circle-clipper right">
                    <div class="circle"></div>
                </div>
            </div>

            <div class="spinner-layer spinner-green">
                <div class="circle-clipper left">
                    <div class="circle"></div>
                    </div><div class="gap-patch">
                    <div class="circle"></div>
                    </div><div class="circle-clipper right">
                    <div class="circle"></div>
                </div>
            </div>
        </div>
        <p>Connecting...</p>
    </div>

    <div ng-hide="room || !connected">
        <ul class="tabs">
            <li class="tab col s2"><a href="#room-history-page"><?= _('Room History') ?></a></li>
            <li class="tab col s2"><a href="#room-list-page"><?= _('My Rooms') ?></a></li>
            <li class="tab col s2"><a href="#form-create-room"><?= _('Create Room') ?></a></li>
        </ul>
        <div id=room-history-page>
            <ul id=room-history class="collection">
                <li class="room collection-item" ng-repeat="room in history"><a class="title" ng-href="{{room.id}}" ng-bind=room.title></a></li>
            </ul>
        </div>
        <div id=room-list-page>
            <ul id=room-list class="collection">
                <li class="room collection-item" ng-repeat="room in rooms"><a class="title" ng-href="{{room.id}}" ng-bind=room.title></a></li>
            </ul>
        </div>
        <form id=form-create-room onsubmit="return false" ng-submit=createRoom() >
            <p>
                <!-- .row -->
                <div class="row">
                    <div class="input-field col s12">
                        <input type=text name=title ng-model=create_title id=form-create-room-title required>
                        <label for=form-create-room-title><?= _('Room Title') ?></label>
                    </div>
                </div>
                <!-- /.row -->
            </p>
            <button class="waves-effect btn-flat" style="margin-bottom: 0"><?= _('Create') ?></button>
        </form>
    </div>

    <main class="flex-grow-shrink-1 scroll-y" ontouchmove="event.stopPropagation()" ng-show="room">
        <!-- .container -->
        <div class="container">
            <!-- .flex-grow-shirink-1 -->
            <div id=message-list>
                <div class="message" ng-repeat="message in messages | toArray | orderBy:'created'" on-finish-render="messageScroll()" data-id="{{message.id}}">
                    <div class="header" style="border-color: {{message.color}};" ng-show="message.isHeader">
                        <div class="icon-container"><div ng-show=message.icon class="icon" style="border-color: {{message.color}}; background-image: url({{message.icon}});"></div></div>
                        <span class="name" style="color: {{message.color}};" ng-bind=message.name></span>
                        <span class="user_id" ng-bind=message.user_id></span>
                        <a ng-if=message.url target=_blank ng-href="{{message.url}}"><i class="mdi-action-assignment-ind right-align"></i></a>
                    </div>
                    <div class="modified" ng-show="message.isHeader" ng-bind="message.modified | date: 'hh:mm'"></div>
                    <div class="message" ng-bind=message.message></div>
                </div>
            </div>
            <!-- /.flex-grow-shirink-1 -->
            <!-- #writing -->
            <div id="writing-list">
                <div class="writing" ng-repeat="writing in writings">
                    <i class="mdi-editor-mode-edit"></i>
                    <span data-field=name ng-bind=writing.name></span>
                    <span data-field=user_id ng-bind=writing.user_id></span>
                </div>
            </div>
            <!-- /#writing -->
        </div>
        <!-- /.container -->
    </main>

    <div class="z-depth-2" ng-show=room>
        <!-- .container -->
        <div class="container">
            <!-- #message-form-list -->
            <div id=message-form-list>
                <form class="message-form flex" onsubmit="return false" ng-submit="submitMessage(form)" ng-repeat="form in forms | reverse">
                    <input type=hidden class="name" ng-bind=form.name>
                    <input type=hidden class="character_url" ng-bind=form.character_url>
                    <a href=# onclick="return false" ng-if="$index == 0" class="waves-effect waves-light btn-flat icon" style="margin-bottom: 0" ng-click="addForm()"><i class="mdi-content-add"></i></a>
                    <a href=# onclick="return false" ng-if="$index != 0" class="waves-effect waves-light btn-flat icon" style="margin-bottom: 0" ng-click="removeForm($index)"><i class="mdi-content-remove"></i></a>
                    <a class="waves-effect waves-light btn-flat icon" style="margin-bottom: 0" href=# onclick="return false" ng-click="messageSettingModal(form)"><i class="mdi-action-settings"></i></a>
                    <input class="message flex-grow-shrink-1" placeholder="{{form.name}}" ng-model=form.message ng-change="formChange(form)" ng-focus="formFocus(form)" ng-blur="formBlur(form)">
                    <button class="waves-effect waves-light btn icon sharp-left" style="margin-bottom: 0"><i class="mdi-content-send"></i></button>
                </form>
            </div>
            <!-- /#message-form-list -->
        </div>
        <!-- /.container -->
    </div>

    <div id="modal-connecting" class="modal">
        <h4><?= _('Connecting') ?></h4>
        <p><?= _('Please wait...') ?></p>
    </div>

    <div id="modal-room-selector" class="modal">
        <ul class="tabs">
            <li class="tab col s2"><a href="#room-history-page"><?= _('Room History') ?></a></li>
            <li class="tab col s2"><a href="#room-list-page"><?= _('My Rooms') ?></a></li>
            <li class="tab col s2"><a href="#form-create-room"><?= _('Create Room') ?></a></li>
        </ul>
        <div id=room-history-page>
            <ul id=room-history class="collection">
                <li class="room template collection-item"><a class="title" href="#"></a></li>
            </ul>
            <a href="#" class="waves-effect btn-flat modal-close" style="margin-bottom: 0"><?= _('Close') ?></a>
        </div>
        <div id=room-list-page>
            <ul id=room-list class="collection">
                <li class="room template collection-item"><a class="title" href="#"></a></li>
            </ul>
            <a href="#" class="waves-effect btn-flat modal-close" style="margin-bottom: 0"><?= _('Close') ?></a>
        </div>
        <form id=form-create-room onsubmit="return false">
            <p>
                <!-- .row -->
                <div class="row">
                    <div class="input-field col s12">
                        <input type=text name=title class=title id=form-create-room-title required>
                        <label for=form-create-room-title><?= _('Room Title') ?></label>
                    </div>
                </div>
                <!-- /.row -->
            </p>
            <button id=form-create-room-create class="waves-effect btn-flat" style="margin-bottom: 0"><?= _('Create') ?></button>
            <button class="modal-close waves-effect btn-flat" style="margin-bottom: 0"><?= _('Close') ?></button>
        </form>
    </div>

    <div id=modal-message-setting class="modal">
        <h4><?= _('Chat Settings') ?></h4>
        <br>
        <!-- .row -->
        <div class="row">
            <form id=form-message-setting onsubmit="return false">
                <!-- .col -->
                <div class="col s4">
                    <div class="input-field">
                        <input id=form-formsetting-name type="text" class="name" ng-model=activeForm.name>
                        <label for=form-formsetting-name><?= _('Name') ?></label>
                    </div>
                </div>
                <!-- /.col -->

                <!-- .col -->
                <div class="col s8">
                    <div class="input-field">
                        <input id=form-formsetting-character-url type="text" ng-model=activeForm.character_url ng-change=setCharacterName()>
                        <label for=form-formsetting-character-url><?= _('Character URL') ?></label>
                    </div>
                </div>
                <!-- /.col -->
            </form>

        </div>
        <!-- /.row -->
        <a href='#' class="wave-effect btn-flat modal-close"><?= _('Close') ?></a>
    </div>

    <div id=modal-global-setting class="modal">
        <h4><?= _('Global Settings') ?></h4>
        <!-- .row -->
        <div class="row">
            <form id=form-global-setting onsubmit="return false">
                <!-- .col -->
                <div class="col s12">
                    <p class="range-field">
                        <label for=form-global-setting-volume><?= _('Volume') ?></label>
                        <input id=form-global-setting-volume type="range" class="volume" ng-model=volume ng-change="setVolume()">
                    </p>
                </div>
                <!-- /.col -->
            </form>
        </div>
        <!-- /.row -->

        <a href=# class="wave-effect btn-flat modal-close" style="margin-bottom: 0;"><?= _('Close') ?></a>
    </div>

    <audio id=alert src="sound/nc32318.wav" preload=auto></audio>

    <script src="lib/jquery/jquery.js"></script>
    <script src="lib/socket.io-client/socket.io.js"></script>
    <script src="lib/materialize/js/materialize.js"></script>
    <script src="lib/angular/angular.js"></script>
    <script src="lib/angular-socket-io/socket.js"></script>
    <script src="lib/cssdice/dice.js"></script>
    <script src="js/jquery.cssanim.js"></script>
    <script src="js/init.js"></script>
    <script src="js/main.js"></script>
</body>
</html>
