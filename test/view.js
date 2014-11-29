'use strict';
QUnit.module('View', {
    setup: function () {
        View.Message.data = [];
    },
    teardown: function () {
        $('#message-list .message:not(.template)').remove();
    }
});

QUnit.test('View', function (assert) {
    assert.ok(View);
});

QUnit.test('Message', function (assert) {
    assert.ok(View.Message);
});

QUnit.test('Message.add', function (assert) {
    assert.equal(View.Message.list.find('.message:not(.template)').length, 0);

    var msg = [
    {
        id: 0,
        name: 'test',
        message: 'message 0 body'
    },
    {
        id: 1,
        name: 'test',
        message: 'message 1 body'
    },
    {
        id: 2,
        name: 'foo',
        message: 'message 2 body'
    }
    ];

    View.Message.add(msg[1]);
    var items = View.Message.list.find('.message:not(.template)');
    assert.equal(items.length, 1);
    var item = $(items[0]);
    assert.equal(item.length, 1);
    assert.equal(item.find('[data-field=name]').text(), msg[1].name);
    assert.equal(item.find('[data-field=message]').text(), msg[1].message);

    View.Message.add(msg[0]);
    items = View.Message.list.find('.message:not(.template)');
    assert.equal(items.length, 2);
    item = $(items[0]);
    assert.equal(item.length, 1);
    assert.equal(item.attr('data-id'), msg[0].id);
    assert.equal(item.find('[data-field=name]').text(), msg[0].name);
    assert.equal(item.find('[data-field=message]').text(), msg[0].message);

    View.Message.add(msg[2]);
    items = View.Message.list.find('.message:not(.template)');
    assert.equal(items.length, 3);
    item = $(items[2]);
    assert.equal(item.length, 1);
    assert.equal(item.attr('data-id'), msg[2].id);
    assert.equal(item.find('[data-field=name]').text(), msg[2].name);
    assert.equal(item.find('[data-field=message]').text(), msg[2].message);
});
