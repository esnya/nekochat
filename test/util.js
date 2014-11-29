'use strict';
QUnit.module('Util');

QUnit.test('Util', function (assert) {
    assert.ok(Util);
});

QUnit.test('insertIndexAt', function (assert) {
    var arr = [0, 1, 2, 4, 5];
    assert.equal(Util.insertIndexAt(arr, 3), 3);
    assert.equal(Util.insertIndexAt(arr, 6), 5);
    assert.equal(Util.insertIndexAt(arr, -1), 0);
});

QUnit.test('insertIndexAt - Custom Compare', function (assert) {
    var arr = [{id: 0}, {id: 1}, {id: 2}, {id: 4}, {id: 5}];
    assert.equal(Util.insertIndexAt(arr, {id: 3}, function (a, b) { return a.id - b.id; }), 3);
    assert.equal(Util.insertIndexAt(arr, {id: 6}, function (a, b) { return a.id - b.id; }), 5);
    assert.equal(Util.insertIndexAt(arr, {id: -1}, function (a, b) { return a.id - b.id; }), 0);
});

QUnit.test('insertIndexAt', function (assert) {
    var arr = [0, 1, 2, 4, 5];
    Util.insertAt(arr, 3, 3);
    assert.equal(arr.length, 6);
    for (var i = 0; i < 6; ++i) {
        assert.equal(arr[i], i);
    }
});
