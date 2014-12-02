'use strict';

QUnit.module('View', {
    setup: function () {
        View.setUser({ id: 'userid', name: 'username'});
        View.reset();
    },
    teardown: function () {
        View.reset();
    }
});

QUnit.test('View', function (assert) {
    assert.ok(View);
});

QUnit.test('View.reset', function (assert) {
    var template = $('#message-list .template');
    for (var i = 0; i < 10; ++i) {
        template.clone().removeClass().appendTo('#message-list');
        $('<div>').addClass('icon').appendTo('#message-list');
    }

    template = $('#writing-list .template');
    for (var i = 0; i < 10; ++i) {
        template.clone().removeClass().appendTo('#writing-list');
    }

    assert.notEqual($('#message-list > *:not(.template)').length, 0);
    assert.notEqual($('#writing-list > *:not(.template)').length, 0);

    View.reset();

    assert.equal($('#message-list > *:not(.template)').length, 0);
    assert.equal($('#writing-list > *:not(.template)').length, 0);
});

QUnit.test('View.addMessage', function (assert) {
    View.addMessage({
        id: 2,
        user_id: 'test',
        name: 'foo',
        message: 'foo message 2',
        created: new Date("Aug 9, 1995 13:02:00"),
        modified: new Date("Aug 9, 1995 13:02:00")
    });

    var messages = $('#message-list > *:not(.template)');
    assert.equal(messages.length, 1);

    var message = $(messages[0]);
    assert.equal(message.data('id'), 2);
    assert.equal(message.find('.name').text(), 'foo');
    assert.equal(message.find('.user_id').text(), 'test');
    assert.equal(message.find('.message').text(), 'foo message 2');
    assert.equal(message.find('.modified').text(), '13:02');

    View.addMessage({
        id: 4,
        user_id: 'test',
        name: 'bar',
        message: 'bar message 4',
        created: new Date("Aug 9, 1995 00:12:00"),
        modified: new Date("Aug 9, 1995 00:14:00")
    });

    var messages = $('#message-list > *:not(.template)');
    assert.equal(messages.length, 2);

    var message = $(messages[0]);
    assert.equal(message.data('id'), 2);

    var message = $(messages[1]);
    assert.equal(message.data('id'), 4);
    assert.equal(message.find('.name').text(), 'bar');
    assert.equal(message.find('.modified').text(), '0:14');

    View.addMessage({
        id: 5,
        user_id: 'test',
        name: 'bar',
        message: 'bar message 5',
        created: new Date("Aug 9, 1995 00:15:00"),
        modified: new Date("Aug 9, 1995 00:15:00")
    });

    var messages = $('#message-list > *:not(.template)');
    assert.equal(messages.length, 3);

    var message = $(messages[2]);
    assert.equal(message.data('id'), 5, 'message id');
    assert.ok(message.find('.name').is(':hidden'), 'hidden');
    assert.ok(message.find('.user_id').is(':hidden'), 'hidden');

    View.addMessage({
        id: 3,
        user_id: 'test',
        name: 'foo',
        message: 'foo message 3',
        created: new Date("Aug 9, 1995 14:02:00"),
        modified: new Date("Aug 9, 1995 14:02:00")
    });

    var messages = $('#message-list > *:not(.template)');
    assert.equal(messages.length, 4);

    var message = $(messages[1]);
    assert.equal(message.data('id'), 3, 'message id');
    assert.ok(message.find('.name').is(':hidden'), 'hidden');
    assert.ok(message.find('.user_id').is(':hidden'), 'hidden');

    View.addMessage({
        id: 1,
        user_id: 'test',
        name: 'foo',
        message: 'foo message 1',
        created: new Date("Aug 9, 1995 10:02:00"),
        modified: new Date("Aug 9, 1995 10:02:00")
    });

    var messages = $('#message-list > *:not(.template)');
    assert.equal(messages.length, 5, 'number of messages');

    var message = $(messages[0]);
    assert.equal(message.data('id'), 1, 'id');
    assert.ok(!message.find('.name').is(':hidden'), 'not hidden');
    assert.ok(!message.find('.user_id').is(':hidden'), 'not hidden');

    var message = $(messages[1]);
    assert.equal(message.data('id'), 2, 'id');
    assert.ok(message.find('.name').is(':hidden'), 'hidden');
});

QUnit.asyncTest('View.addMessage (character_url)', function (assert) {
    assert.expect(11 + 4 + 7);

    View.addMessage({
        id: 2,
        user_id: 'test',
        name: 'foo',
        message: 'foo message 2',
        character_url: 'character1.json',
        created: new Date("Aug 9, 1995 13:02:00"),
        modified: new Date("Aug 9, 1995 13:02:00")
    }).then(function () {
        var messages = $('#message-list > *:not(.template)');
        assert.equal(messages.length, 2, 'number of messages');

        var icon = $(messages[0]);
        assert.ok(icon.is('.icon'), 'is icon');
        assert.ok(icon.css('background-image'), 'url("http://' + location.host + '/portrait/to/test/character/1.png")', 'image url');

        var message = $(messages[1]);
        assert.ok(message.is('.message'), 'is message');
        assert.equal(message.data('id'), 2, 'id');
        assert.equal(message.find('.name').text(), 'foo', 'name');
        assert.equal(message.find('.user_id').text(), 'test', 'user_id');
        assert.equal(message.find('.message').text(), 'foo message 2', 'message');
        assert.equal(message.find('.modified').text(), '13:02', 'modified');

        assert.equal(message.find('.name').attr('href'), '/url/to/test/character/1');
    }).then(function () {
        return View.addMessage({
            id: 3,
            user_id: 'test',
            name: 'foo',
            message: 'foo message 3',
            character_url: 'character1.json',
            created: new Date("Aug 9, 1995 13:02:00"),
            modified: new Date("Aug 9, 1995 13:02:00")
        });
    }).then(function () {
        var messages = $('#message-list > *:not(.template)');
        assert.equal(messages.length, 3, 'number of messages');

        assert.ok($(messages[0]).is('.icon'), 'is icon');
        assert.ok($(messages[1]).is('.message'), 'is message');
        assert.ok($(messages[2]).is('.message'), 'is message');

        return  View.addMessage({
            id: 4,
            user_id: 'test',
            name: 'bar',
            message: 'bar message 4',
            character_url: 'character2.json',
            created: new Date("Aug 9, 1995 13:02:00"),
            modified: new Date("Aug 9, 1995 13:02:00")
        });
    }).then(function () {
        var messages = $('#message-list > *:not(.template)');
        assert.equal(messages.length, 4, 'number of messages');

        assert.ok($(messages[0]).is('.icon'), 'is icon');
        assert.ok($(messages[1]).is('.message'), 'is message');
        assert.ok($(messages[2]).is('.message'), 'is message');
        assert.ok($(messages[3]).is('.message'), 'is message');

        var message = $(messages[3]);
        assert.equal(message.data('id'), 4, 'id');
        assert.ok(!message.find('.name').is(':hidden'), 'not hidden');
        assert.ok(!message.find('.user_id').is(':hidden'), 'not hidden');
    }).then(function () {
        QUnit.start();
    }, function () {
        assert.ok(false, 'failed');
        QUnit.start();
    });
});

QUnit.test('View.addUser', function (assert) {
    var writings = $('#writing-list > *:not(.template)');
    assert.equal(writings.length, 0, 'number of wirtings');

    View.addUser({ id: 'foo', name: 'name of foo' });

    var writings = $('#writing-list > *:not(.template)');
    assert.equal(writings.length, 1, 'number of wirtings');

    var writing = $(writings[0]);
    assert.equal(writing.data('id'), 'foo', 'data-id');
    assert.equal(writing.find('.id').text(), 'foo', 'id');
    assert.equal(writing.find('.name').text(), 'name of foo', 'name');

    View.addUser({ id: 'bar', name: 'name of bar' });

    var writings = $('#writing-list > *:not(.template)');
    assert.equal(writings.length, 2, 'number of wirtings');

    var writing = writings.filter('[data-id=bar]');
    assert.equal(writing.data('id'), 'bar', 'data-id');
    assert.equal(writing.find('.id').text(), 'bar', 'id');
    assert.equal(writing.find('.name').text(), 'name of bar', 'name');

    View.addUser({ id: 'bar', name: 'name of bar' });
    var writings = $('#writing-list > *:not(.template)');
    assert.equal(writings.length, 2, 'number of wirtings');
});

QUnit.asyncTest('View.closeModal', function (assert) {
    assert.expect(2);

    $('a[href="#modal1"]').trigger('click');

    setTimeout(function () {
        View.closeModal().then(function () {
            assert.ok($('#lean_overlay').is(':hidden'), 'hidden overlay');
            assert.ok($('#modal1').is(':hidden'), 'hidden #modal1');
            QUnit.start();
        }, function () {
            assert.ok(false, 'failed');
            QUnit.start();
        });
    }, 300);
});

QUnit.test('View.get/setHash', function (assert) {
    var old = location.hash;

    $(window).bind('hashchange', function () {
        assert.ok(false, 'hash change called');
    });

    location.hash = '#foo';
    assert.equal(View.getHash(), '#foo');

    View.setHash('#bar');
    assert.equal(View.getHash(), '#bar');
    assert.equal(location.hash, '#bar');

    $(window).unbind('hashchange');
    location.hash = old;
});

QUnit.test('View.setRoomList', function (assert) {
    View.setRoomList([
            { id: '#foo', title: 'foo' },
            { id: '#bar', title: 'bar' },
            { id: '#foobar', title: 'foobar' }
    ]);

    var rooms = $('#room-list > *:not(.template)');
    assert.equal(rooms.length, 3, 'number of rooms');

    assert.equal($(rooms[1]).find('.title').text(), 'bar');
    assert.equal($(rooms[1]).find('.title').attr('href'), '#bar');

    View.setRoomList([
            { id: '#foo', title: 'foo' },
            { id: '#bar', title: 'bar' },
            { id: '#foobar', title: 'foobar' }
    ]);
    var rooms = $('#room-list > *:not(.template)');
    assert.equal(rooms.length, 3, 'number of rooms');
});

QUnit.test('View.setTitle', function (assert) {
    View.setTitle('foo', '#foo');

    assert.ok(document.title.match('^foo'), 'document');

    var logo = $('.brand-logo');
    assert.equal(logo.text(), 'foo', 'header');
    assert.equal(logo.attr('href'), '#foo', 'header href');
});

QUnit.asyncTest('View.showRoomSelector', function (assert) {
    assert.expect(1);

    View.showRoomSelector();
    setTimeout(function () {
        assert.ok(!$('#modal-room-selector').is(':hidden'), 'modal shown');

        View.closeModal();
        setTimeout(function () {
            QUnit.start();
        }, 500);
    }, 500);
});

QUnit.asyncTest('View.showConnectingModal', function (assert) {
    assert.expect(4);

    View.showConnectingModal();

    setTimeout(function () {
        assert.ok(!$('#modal-connecting').is(':hidden'), 'modal shown');
        assert.ok(!$('#lean_overlay').is(':hidden'), 'overlay shown');

        $('#leanModal').trigger('click');

        setTimeout(function () {
            assert.ok(!$('#modal-connecting').is(':hidden'), 'modal shown');
            assert.ok(!$('#lean_overlay').is(':hidden'), 'overlay shown');

            View.closeModal();
            setTimeout(function () {
                QUnit.start();
            }, 500);
        }, 500);
    }, 500);
});

QUnit.asyncTest('View.begin/endWriting', function (assert) {
    assert.expect(4);

    View.addUser({ id: 'foo', name: 'name of foo' });
    View.addUser({ id: 'bar', name: 'name of bar' });

    View.beginWriting('foo', 'foobar');

    setTimeout(function () {
        var writings = $('#writing-list .writing');

        assert.equal(writings.filter(':hidden').length, 1);

        var writing = $(writings.filter('[data-id=foo]'));
        assert.equal(writing.find('.id').text(), 'foo');
        assert.equal(writing.find('.name').text(), 'foobar');

        View.endWriting('foo');

        setTimeout(function () {
            var writings = $('#writing-list .writing:hidden');
            assert.equal(writings.length, 2);
            QUnit.start();
        }, 500);
    }, 500);
});

QUnit.test('on show.roomselector', function (assert) {
    assert.expect(2);

    View.on('show.roomselector', function () {
        assert.ok(true);
    });

    View.showRoomSelector();
    $('a.modal-trigger[href="#modal-room-selector"]').trigger('click');
});

QUnit.test('on submit.message', function (assert) {
    assert.expect(4);

    View.on('submit.message', function (message) {
        assert.equal(message.name, 'foo');
        assert.equal(message.character_url, '/url/to/character');
        assert.equal(message.message, 'something to send');

        View.on('submit.message', null);
    });

    var form = $('#message-form-list form:not(.template)');
    assert.equal(form.length, 1);

    form.find('.name').val('foo');
    form.find('.character_url').val('/url/to/character');
    form.find('.message').val('something to send');

    form.trigger('submit');
});

//QUnit.asyncTest('on hashchange', function (assert) {
//    assert.expect(1);
//
//    View.on('hashchange', function (hash) {
//        assert.equal(hash, '#foobar');
//        View.on('hashchange', null);
//        location.hash = '';
//        QUnit.start();
//    })
//
//    location.hash = '#foobar';
//
//    $(window).trigger('hashchange');
//});

QUnit.test('on create.rooom', function (assert) {
    assert.expect(1);

    View.on('create.room', function (title) {
        assert.equal(title, 'room title is bar');
        View.on('create.room', null);
    });

    $('#form-create-room .title').val('room title is bar');
    $('#form-create-room').trigger('submit');
});

QUnit.asyncTest('setting message form', function (assert) {
    assert.expect(9);

    var form = $('#message-form-list form:not(.template)');
    assert.equal(form.length, 1, 'form exists');

    assert.equal(form.find('.name').val(), 'username',  'user name');
    assert.equal(form.find('.message').attr('placeholder'), 'username', 'user name (placeholder)');

    form.find('.name').val('bar');
    form.find('.character_url').val('http://host/path');
    form.find('.message').val('something to send!!');


    form.find('a[href]').trigger('click');

    setTimeout(function () {
        var modal = $('#modal-message-setting');
        assert.ok(!modal.is(':hidden'), 'modal shown');

        assert.equal(modal.find('form .name').val(), 'bar');
        assert.equal(modal.find('form .character_url').val(), 'http://host/path');

        modal.find('form .name').val('foo').trigger('change');
        modal.find('form .character_url').val('http://hoge/hogehoge').trigger('change');

        assert.equal(form.find('.name').val(), 'foo');
        assert.equal(form.find('.message').attr('placeholder'), 'foo');
        assert.equal(form.find('.character_url').val(), 'http://hoge/hogehoge');

        View.closeModal();
        setTimeout(function () {
            QUnit.start();
        }, 400);
    }, 400);
});

QUnit.asyncTest('setting message form with character_url', function (assert) {
    assert.expect(4);

    var form = $('#message-form-list form:not(.template)');
    assert.equal(form.length, 1, 'form exists');

    form.find('a[href]').trigger('click');

    setTimeout(function () {
        var modal = $('#modal-message-setting');

        var url = location.origin + location.pathname.replace(/[^\/]*$/, 'character1.json');
        modal.find('form .character_url').val(url).trigger('change');

        setTimeout(function () {
            assert.equal(modal.find('form .name').val(), 'test character 1', 'name changed');
            assert.equal(form.find('.name').val(), 'test character 1');
            assert.equal(form.find('.message').attr('placeholder'), 'test character 1');

            View.closeModal();
            setTimeout(function () {
                View.closeModal();
                QUnit.start();
            }, 400);
        }, 400);
    }, 400);
});

QUnit.test('volume', function (assert) {
    var a = $('#alert');
    var range = $('#modal-global-setting .volume');

    assert.equal(a.length, 1, 'alert audio exists');
    assert.equal(range.length, 1, 'range input exists');

    assert.equal(a[0].volume, range.val() / 100.0, 'init value');

    range.val(0).trigger('change');
    assert.equal(a[0].volume, 0, '0');

    range.val(50).trigger('change');
    assert.equal(a[0].volume, 0.5, '0.5');

    range.val(100).trigger('change');
    assert.equal(a[0].volume, 1, '1');
});

QUnit.test('input history', function (assert) {
    var form = $('#message-form-list form:not(.template)');
    assert.equal(form.length, 1);

    var message = form.find('.message');
    
    message.val('something to send');
    form.trigger('submit');

    assert.equal(message.val().length, 0);

    var event = $.Event('keydown');
    event.keyCode = 38;
    message.trigger(event);
    assert.equal(message.val(), 'something to send');
});

QUnit.test('restore latest setting', function (assert) {
    var form = $('#message-form-list form:not(.template)');
    assert.equal(form.length, 1);

    var name = form.find('.name');
    var character_url = form.find('.character_url');
    
    assert.equal(name.val(), 'username');
    assert.equal(character_url.val(), '');

    View.addMessage({
        id: 10,
        user_id: 'hoge',
        character_url: 'url1',
        name: 'hogehoge',
        message: 'test',
        created: new Date,
        modified: new Date
    });

    assert.equal(name.val(), 'username');
    assert.equal(character_url.val(), '');

    View.addMessage({
        id: 9,
        user_id: 'userid',
        character_url: 'url2',
        name: 'foobar',
        message: 'foo',
        created: new Date,
        modified: new Date
    });

    assert.equal(name.val(), 'foobar');
    assert.equal(character_url.val(), 'url2');
});
