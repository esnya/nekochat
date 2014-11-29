<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>Beniimo Online</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <link rel="stylesheet" href="css/materialize.min.css">
    <link rel="stylesheet" href="css/main.css">
</head>
<body class="flex flex-column" ontouchmove="event.preventDefault()">
    <nav>
        <!-- .container -->
        <div class="container">
            <!-- .nav-wrapper -->
            <div class="nav-wrapper">
                <a href="#" class="brand-logo">Beniimo Online</a>
                <ul id="nav-mobile" class="right side-nav">
                    <li><a href="#" data-action="roomlist">Switch Room</a></li>
                    <li><a href=#modal-globalsetting class="modal-trigger">Global Settings</a></li>
                </ul>
                <a class="button-collapse" href="#" data-activates="nav-mobile"><i class="mdi-navigation-menu"></i></a>
            </div>
            <!-- /.nav-wrapper -->
        </div>
        <!-- /.container -->
    </nav>

    <main class="flex-grow-shrink-1 scroll-y" ontouchmove="event.stopPropagation()">
        <!-- .container -->
        <div class="container">
            <!-- .flex-grow-shirink-1 -->
            <div id=message-list>
                <div class="message template">
                    <div data-field=name></div>
                    <div data-field=message></div>
                </div>
            </div>
            <!-- /.flex-grow-shirink-1 -->
            <!-- #writing -->
            <div id="writing-list">
                <div class="writing template">
                    <i class="mdi-editor-mode-edit"></i>
                    <span data-field=name></span>
                    <span data-field=user_id></span>
                </div>
            </div>
            <!-- /#writing -->
        </div>
        <!-- /.container -->
    </main>

    <footer class="z-depth-2">
        <!-- .container -->
        <div class="container">
            <!-- #message-form-list -->
            <div id=message-form-list>
                <form class="flex" onsubmit="return false">
                    <input type=hidden class=flex-grow-shrink-1 data-field=name>
                    <input type=hidden class=flex-grow-shrink-1 data-field=character_url>
                    <button class="waves-effect waves-light btn-flat icon" style="margin-bottom: 0"><i class="mdi-content-add"></i></button>
                    <a class="waves-effect waves-light btn-flat icon modal-trigger" style="margin-bottom: 0" href=#modal-formsetting><i class="mdi-action-settings"></i></a>
                    <input class="flex-grow-shrink-1" data-field=message placeholder="">
                    <button class="waves-effect waves-light btn icon sharp-left" style="margin-bottom: 0"><i class="mdi-content-send"></i></button>
                </form>
            </div>
            <!-- /#message-form-list -->
        </div>
        <!-- /.container -->
    </footer>

    <div id="modal-connecting" class="modal">
        <h4>Connecting</h4>
        <p>Please wait...</p>
    </div>

    <div id="modal-roomselect" class="modal">
        <ul class="tabs">
            <li class="tab col s2"><a href="#roomlist">My Rooms</a></li>
            <li class="tab col s2"><a href="#form-createroom">Create Room</a></li>
        </ul>
        <div id="roomlist">
            <br>
            <div class="collection">
            </div>
            <a href="#" class="waves-effect btn-flat modal_close" style="margin-bottom: 0">Close</a>
        </div>
        <form id=form-createroom onsubmit="return false">
            <p>
                <!-- .row -->
                <div class="row">
                    <div class="input-field col s12">
                        <input type=text name=title id=form-createroom-title required>
                        <label for=form-createroom-title>Room Title</label>
                    </div>
                </div>
                <!-- /.row -->
                <!-- .row -->
                <div class="row">
                    <select name=game id=form-createroom-game required>
                        <option>Select Game</option>
                        <option value="Any">No Select</option>
                        <option value=sword_world2>Sword World 2.0</option>
                        <option value=kancolle_rpg>Kancolle RPG</option>
                    </select>
                </div>
                <!-- /.row -->
                <div class="row">
                </div>
                <!-- /.row -->
            </p>
            <button id=form-createroom-create class="waves-effect btn-flat" style="margin-bottom: 0">Create</button>
            <button id=form-createroom-create class="modal_close waves-effect btn-flat" style="margin-bottom: 0">Cancel</button>
        </form>
    </div>

    <div id=modal-formsetting class=modal>
        <h4>Chat Settings</h4>
        <!-- .row -->
        <div class="row">
            <form id=form-formsetting onsubmit="return false">
                <!-- .col -->
                <div class="col s4">
                    <div class="input-field">
                        <input id=form-formsetting-name type="text" data-field=name>
                        <label for=form-formsetting-name>Name</label>
                    </div>
                </div>
                <!-- /.col -->

                <!-- .col -->
                <div class="col s8">
                    <div class="input-field">
                        <input id=form-formsetting-character-url type="text" data-field=character_url>
                        <label for=form-formsetting-character-url>Character URL</label>
                    </div>
                </div>
                <!-- /.col -->
            </form>

        </div>
        <!-- /.row -->
        <a href=# class="wave-effect btn-flat modal_close" style="margin-bottom: 0;">Close</a>
    </div>

    <div id=modal-globalsetting class="modal">
        <h4>Global Settings</h4>
        <!-- .row -->
        <div class="row">
            <form id=form-globalsetting onsubmit="return false">
                <!-- .col -->
                <div class="col s12">
                    <p class="range-field">
                        <input id=form-globalsetting-volume type="range" value=100>
                        <label for=form-globalsetting-volume>Chat Alert Volume</label>
                    </p>
                </div>
                <!-- /.col -->
            </form>
        </div>
        <!-- /.row -->

        <a href=# class="wave-effect btn-flat modal_close" style="margin-bottom: 0;">Close</a>
    </div>

    <div style="display: none;">
        <a class="modal-trigger" href="#modal-connecting"></a>
        <a class="modal-trigger" href="#modal-createroom"></a>
    </div>

    <audio id=alert src="sound/nc32318.wav" preload=auto></audio>

    <script type="text/javascript" src="https://code.jquery.com/jquery-2.1.1.min.js"></script>
    <script src="https://cdn.socket.io/socket.io-1.2.1.js"></script>
    <script type="text/javascript" src="js/materialize.min.js"></script>
    <script src="js/init.js"></script>
    <script src="js/util.js"></script>
    <script src="js/view.js"></script>
    <script src="js/main.js"></script>
</body>
</html>
