(function (View, $) {
    'use strict';

    var _user;
    var _messages, _maxMessageId;
    var _listeners = {};

    var trigger = function (e) {
        var listener = _listeners[e];
        if (listener) {
            listener.apply(View, arguments.length > 1 ? Array.slice(arguments, 1) : undefined);
        }
    };

    var appendMessageForm = function () {
        var list = $('#message-form-list');
        var item = list.find('.template').clone().removeClass('template').appendTo(list).messageForm();
    };

    var _characterCache = {};
    var getCharacter = function (url) {
        var d = new $.Deferred;
        if ((url in _characterCache) && (new Date - _characterCache[url].time) < 60 * 1000) {
            d.resolve(_characterCache[url].data);
        } else {
            $.getJSON(url).then(function (data) {
                _characterCache[url] = {
                    time: new Date,
                    data: data
                };
                d.resolve(data);
            }, function (error, data) {
                d.reject(error, data);
            });
        }

        return d.promise();
    };

    var makeColor = function (data) {
        var rgb = [data.slice(0, data.length / 3), data.slice(data.length / 3, 2 * data.length / 3), data.slice(2 * data.length / 3)].map(function (data) {
            var sum = 0;
            for (var i = 0; i < data.length; ++i) {
                sum += data.charCodeAt(i) & 0xff;
            }
            return sum & 0xff;
        });
        rgb.push(1);
        return 'rgba(' + rgb.join(",") + ')';
    };

    var playNoticeAlert = function () {
        $('#alert').each(function () {
            this.play();
        });
    };

    ///
    View.on = function (e, listener) {
        _listeners[e] = listener;
    }

    ///
    View.setUser = function (user) {
        _user = user;

        if (user) {
            var messageForm = $('#message-form-list .message-form.template');
            messageForm.messageForm('name', user.name);
        }
    };

    ///
    View.reset = function () {
        $('#message-list > *:not(.template)').remove();
        $('#writing-list > *:not(.template)').remove();
        $('#message-form-list > *:not(.template)').remove();

        _messages = {};
        _maxMessageId = -1;

        if (!$('#lean_overlay').is(':hidden')) {
            View.closeModal();
        }

        if ($('#message-form-list > *.message-form:not(.template)').length == 0) {
            appendMessageForm();
        }
    };

    ///
    View.addMessage = function (message) {
        _messages[message.id] = message;
        if (message.id > _maxMessageId) {
            _maxMessageId = message.id;
            playNoticeAlert();
        }

        var color = makeColor(message.name + message.user_id);

        var list = $('#message-list');
        var item = list
            .find('.template')
            .clone()
            .removeClass('template')
            .attr('data-id', message.id);

        item.find('a.name').css('color', color).bind('click', false)
            .parent().css('border-color', color);

        for (var key in message) {
            var value = message[key];

            if (key == 'modified') {
                value = (new Date(value)).toLocaleTimeString().slice(0, -3);
            }

            item.find('.' + key).text(value);
        }

        var aboveId;
        for (aboveId = message.id - 1; aboveId > -1 && !(aboveId in _messages); --aboveId) {}

        var aboveMessage = null;
        if (aboveId >= 0) {
            aboveMessage = _messages[aboveId];
        }

        var isHeadOfName = !aboveMessage || aboveMessage.user_id != message.user_id || aboveMessage.name != message.name;
        var main = $('body > main');
        var hideBelow =false;
        if (isHeadOfName) {
            var belowId;
            for (belowId = message.id + 1; belowId < _maxMessageId && !(belowId in _messages); ++belowId) {}

            if (belowId < _maxMessageId) {
                var belowMessage = _messages[belowId];
                if (belowMessage.user_id == message.user_id && belowMessage.name == message.name) {
                    var hideBelow = true;
                    var below = list.find('[data-id=' + belowId + '] .only-head-of-name');
                    //main.scrollTop(main.scrollTop() - $(below[0]).height());
                    below.hide();
                }
            }
        } else {
            item.find('.only-head-of-name').hide();
        }

        if (aboveId >= 0) {
            list.find('.message[data-id=' + aboveId + ']').after(item);
        } else {
            list.prepend(item);
        }
        if (aboveId < 0 || list.height() - main.scrollTop() - main.height() < item.height() * 2) {
            main.scrollTop(main.scrollTop() + item.height() + (isHeadOfName ? 0 : 0));
        }

        if (isHeadOfName && message.character_url) {
            return getCharacter(message.character_url).then(function (data) {
                var characterColor = data.color || color;

                if (data.url) {
                    item.find('a.name')
                        .css('color', characterColor)
                        .attr('href', data.url)
                        .unbind('click', false)
                        .parent()
                        .css('border-color', characterColor);
                }

                var iconURL = data.icon || data.portrait;
                if (iconURL) {
                    var icon = $('<div class="icon">')
                        .css('border-color', characterColor)
                        .css('background-image', 'url(' + iconURL + ')')
                        .attr('data-id', data.id); 

                        item.addClass('has-icon').before(icon);

                    if (hideBelow) {
                        $('.message[data-id="' + message.id + '"] + .icon[data-id="' + data.id + '"]').remove();
                    }
                }
            });
        } else {
            var d = new $.Deferred;
            d.resolve();
            return d.promise();
        }
    };

    ///
    View.addUser = function (user) {
        var list = $('#writing-list');

        toast(user.name + '@' + user.id + ' joined', 3000);

        if (list.find('.writing[data-id=' + user.id + ']').length == 0) {
            var item = list
                .find('.template')
                .clone()
                .hide()
                .appendTo(list)
                .removeClass('template')
                .attr('data-id', user.id);

            for (var key in user) {
                item.find('.' + key).text(user[key]);
            }
        }
    };

    View.removeUser = function (user) {
        toast(user.name + '@' + user.name + ' defected');
    };

    ///
    View.bind = function (e, callback) {
        _listeners[e] = callback;
    };

    ///
    View.closeModal = function () {
        var d = new $.Deferred;

        $('#lean_overlay, .modal:not(:hidden)').cssFadeOut(200, function () {
            d.resolve();
        });

        return d.promise();
    };

    View.getHash = function () {
        return location.hash;
    };
    View.setHash = function (hash) {
        location.hash = hash;
    };

    View.setRoomList = function (rooms) {
        var list = $('#room-list');
        list.find('.room:not(.template)').remove();
        rooms.forEach(function (room) {
            var item = list
                .find('.template')
                .clone()
                .appendTo(list)
                .removeClass('template')
                .attr('data-id', room.id);

            item.find('a.title').attr('href', room.id);

            for (var key in room) {
                item.find('.' + key).text(room[key]);
            }
        });
    };

    ///
    View.setTitle = function (title, hash) {
        if (!title) {
            title = 'Beniimo Online';
        }
        if (!hash) {
            hash = '#';
        }

        document.title = title;
        $('.brand-logo').text(title).attr('href', hash);
        $('.open-log').attr('href', 'log.php' + hash);
    };

    ///
    View.showModal = function (id) {
        $('<a class="mordal-trigger">').attr('href', '#' + id).leanModal().trigger('click');
    };

    ///
    View.showRoomSelector = function () {
        View.showModal('modal-room-selector');
        trigger('show.roomselector');
    };

    ///
    View.showConnectingModal = function () {
        View.showModal('modal-connecting');
        $('#lean_overlay').unbind('click');
    };

    ///
    View.beginWriting = function (id, name) {
        $('#writing-list .writing[data-id="' + id + '"]').cssFadeIn(200)
            .find('.name').text(name);
    };

    ///
    View.endWriting = function (id) {
        $('#writing-list .writing[data-id="' + id + '"]').cssFadeOut(200);
    };

    ///
    $.fn.messageForm = function (one, two) {
        if (one && two) {
            switch (one) {
                case 'name': 
                    this.find('.message').attr('placeholder', two);
                case 'character_url':
                    this.find('.' + one).val(two);
                    break;
            }
            return this;
        } else if (one) {
        } else {
            this.submit(function () {
                var form = $(this);
                var messageInput = form.find('.message');
                var message = messageInput.val();

                if (message) {
                    messageInput.val('');
                    messageInput.attr('name', 'message' + (new Date).getTime());

                    trigger('submit.message', {
                        name: form.find('.name').val(),
                        character_url: form.find('.character_url').val(),
                        message: message
                    });
                }
            });

            this.find('.message').attr('name', 'message' + (new Date).getTime());
            this.find('.modal-trigger').leanModal().click(function () {
                var form = $(this).parent();
                var modal = $('#modal-message-setting').data('form', form);
                modal.find('form .name').val(form.find('.name').val());
                modal.find('form .character_url').val(form.find('.character_url').val());
            });

            return this;
        }
    };

    $(function () {
        $(window).bind('hashchange', function () {
            trigger('hashchange', location.hash);
        });

        $('a.modal-trigger[href="#modal-room-selector"]').click(function () {
            trigger('show.roomselector');
        });

        $('#modal-message-setting input').change(function () {
            var input = $(this);
            var form = input.closest('.modal').data('form');

            if (form) {
                var field = input.attr('class');
                form.messageForm(field, input.val());
            }
        });
        $('#modal-message-setting .character_url').change(function () {
            var input = $(this);
            var url = input.val();
            if (url) {
                getCharacter(url).done(function (data) {
                    var modal = input.closest('.modal');
                    modal.find('.name').val(data.name).trigger('change');
                });
            }
        });

        $('#modal-global-setting .volume').change(function () {
            var volume = $(this).val() / 100.0;
            $('#alert').each(function (a) {
                this.volume = volume;
            });
        }).trigger('change');

        $('.message-form:not(.template)').messageForm();

        var _requestMessage = false;
        setInterval(function () {
            if ($('body > main').scrollTop() == 0 && $('#message-list .message:not(.template)').length > 0) {
                if (_requestMessage) {
                    trigger('request.message');
                } else {
                    _requestMessage = true;
                }
            } else {
                _requestMessage = false;
            }
        }, 500);
    });
})(this.View || (this.View = {}), jQuery);
