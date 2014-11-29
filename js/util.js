(function (Util) {
    'use strict';

    var insertIndexAtImpl = function (array, needle, cmp) {
        for (var index = 0; index < array.length; ++index) {
            if (cmp(needle, array[index]) < 0) {
                return index;
            }
        }
        return array.length;
    }
    Util.insertIndexAt = function (array, needle, cmp, left, right) {
        var _cmp = (typeof(cmp) == "function") ? cmp : function (a, b) { return a - b; };
        return insertIndexAtImpl(array, needle, _cmp, 0, array.length);
    };

    Util.insertAt = function (array, at, value) {
        ++array.length;
        for (var i = array.length-1; i > at; --i) {
            array[i] = array[i-1];
        }
        array[at] = value;
    };
})(this.Util || (this.Util = {}));
