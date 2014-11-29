(function (View, $) {
    'use strict';

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
    }

    var compareId = function (a, b) {
        return a.id - b.id;
    };

    var characterCache = {};
    var getCharacter = function (character_url) {
        var d = new $.Deferred;

        if ((character_url in characterCache) && ((new Date) - characterCache[character_url].cached ) < 30 * 1000) {
            d.resolve(characterCache[character_url]);
        } else {
            $.getJSON(character_url).fail(function (error) {
                d.reject(error);
            }).done(function (data) {
                data.cached = new Date;
                characterCache[character_url] = data;
                d.resolve(data);
            });
        }

        return d.promise();
    };

    var alertOn = false;
    setTimeout(function () {
        alertOn = true;
        playAlert();
    }, 10 * 1000);
    var playAlert = function () {
        if (alertOn) {
            $('#alert')[0].play();
        }
    };
    
    View.Message = {
        data: [],
        list: $('#message-list'),
        template: $('#message-list .template'),
        create: function (id) {
            return this.template.clone().attr('data-id', id).removeClass('template');
        },
        find: function (id) {
            return this.list.find('.message' + (id ? '[data-id=' + id + ']' : ':not(.template)'));
        },
        set: function (item, key, value) {
            item.find('[data-field="' + key + '"]').text(value);
        },
        add: function (message) {
            var color = makeColor(message.name + message.user_id);

            var index = Util.insertIndexAt(this.data, message, compareId);
            Util.insertAt(this.data, index, message);

            var item = this.create(message.id);

            item.find('[data-field=name]').css('color', color);
            
            for (var key in message) {
                this.set(item, key, message[key]);
            }

            var nofirst = index > 0
                    && this.data[index-1].user_id == message.user_id
                    && this.data[index-1].name == message.name;

            if (nofirst) {
                item.find('[data-field=name]').remove();
            } else {
                item.find('[data-field=name]').append($('<span class=user_id>').text(message.user_id));
            }
           
            if (index == 0) {
                this.list.prepend(item);
            } else if (index == this.data.length-1) {
                this.list.append(item);
            } else {
                this.find(this.data[index-1].id).before(item);
            }
            if (!nofirst) {
                item.before($('<div>').css('clear', 'both'));
            }


            var main = $('main');
            main.scrollTop(main.scrollTop() + item.height() + 13);

            playAlert();

            if (message.character_url) {
                getCharacter(message.character_url).done(function (data) {
                    if (!nofirst) {
                        var icon = data.icon || data.portrait;
                        if (icon) {
                            var icon = $('<div>').css('background-image', 'url(' + icon + ')').css('border-color', data.color || color).addClass('icon');
                            item.before(icon);
                            main.scrollTop(main.scrollTop() + icon.height() - item.height());
                        }

                        if (data.url) {
                            var name = item.find('[data-field=name]');
                            if (name.length > 0) {
                                var url = data.url;
                                if (!url.match(/^http/)) {
                                    url = message.character_url.match(/^https?:\/\/[^\/]+/) + url;
                                }
                                var a = $('<a>').attr('href', url).text(message.name).attr('target', '_blank');
                                name.empty().append(a).append($('<span class=user_id>').text(message.user_id));;
                            }
                        }

                        if (data.color) {
                            item.find('[data-field=name]').css('color', data.color);
                        }
                    }
                });
            } else {
                item.find('[data-field=message]').parent().addClass('offset-s1');
            }
        },
        empty: function () {
            this.list.find('.message:not(.template),img.icon').empty();
        },
        addUser: function (data) {
            toast(data.name + ' joined', 3000);
            var list = $('#writing-list');
            if (list.find('[data-user_id="' + data.id + '"]').length == 0) {
                var item = $('#writing-list .template').clone().removeClass('template').hide().attr('data-user_id', data.id).appendTo(list);
                item.find('[data-field=name]').text(data.name);
                item.find('[data-field=user_id]').text(data.id);
            }
        },
        writing: function (user_id, name) {
            var item = $('#writing-list').find('[data-user_id="' + user_id + '"]');
            item.find('[data-field=name]').text(name);
            var main = $('main');
            main.scrollTop(main.scrollTop() + item.height());
            item.fadeIn();
            clearTimeout(item.data('timer'));
            item.data('timer', setTimeout(function () {
                item.fadeOut();
            }, 5000));
        },
    };

    View.MessageForm = {
        setName: function (target, name) {
            target.find('[data-field=name]').val(name);
            target.find('[data-field=message]').attr('placeholder', name);
        },
        setUser: function (user) {
            $('#message-form-list form:last-child [data-field=name]').val(user.name);
            $('#message-form-list form:last-child [data-field=character_url]').val('');
            $('#message-form-list form:last-child [data-field=message]').attr('placeholder', user.name);
        }
    };
    (function () {
        $('#message-form-list form').submit(function () {
            var form = $(this);
            var messageInput = form.find('[data-field=message]');
            var name = form.find('[data-field=name]').val();
            var character_url = form.find('[data-field=character_url]').val();
            var message = messageInput.val();
            if (message.length > 0) {
                if (View.MessageForm.onsubmit) {
                    View.MessageForm.onsubmit(name, message, character_url);
                }
                messageInput.val('');
                messageInput.attr('name', (new Date()).getTime());
            }
        });

        $('#message-form-list form input[data-field=message]').bind({
            focus: function () {
                var input = $(this);
                input.data('timer', setInterval(function () {
                    if (input.val() && View.MessageForm.onwriting) {
                        View.MessageForm.onwriting(input.parent().find('[data-field=name]').val());
                    }
                }, 2000));
            },
            blur: function () {
                clearInterval($(this).data('timer'));
            }
        });

        $('#message-form-list form .modal-trigger[href=#modal-formsetting]').click(function () {
            var form = $(this).closest('form');
            var modal_form = $('#modal-formsetting form').data('target', $(this).parent());
            modal_form.find('[data-field=name]').val(form.find('[data-field=name]').val());
            modal_form.find('[data-field=character_url]').val(form.find('[data-field=character_url]').val());
        });

        $('#form-formsetting input').change(function () {
            var input = $(this);
            var val = input.val();
            var field = input.data('field');
            var target = input.closest('form').data('target');

            if (field == 'name') {
                View.MessageForm.setName(target, val);
            } else if (field == 'character_url') {
                getCharacter(val).done(function (data) {
                    if (data.name) {
                        View.MessageForm.setName(target, data.name);
                        $('#form-formsetting [data-field=name]').val(data.name);
                    }
                });
                target.find('[data-field=character_url]').val(val);
            }
        });

        $('#form-globalsetting-volume').change(function () {
            $('#alert')[0].volume = $(this).val() / 100.0;
        }).val($('#alert')[0].volume * 100.0);
    }.bind(View.MessageForm))();

    View.RoomList = {
        list: $('#roomlist .collection'),
        set: function (rooms) {
            this.list.empty();
            rooms.sort(function (a, b) {
                if (a > b) return -1;
                else if (a < b) return 1;
                else return 0;
            }).forEach(function (room) {
                $('<a>')
                    .addClass('collection-item')
                    //.addClass('modal_close')
                    .attr('href', room.id)
                    .text(room.title)
                    .appendTo(this.list);
            }.bind(this));
        }
    };
})(this.View || (this.View = {}), jQuery);
