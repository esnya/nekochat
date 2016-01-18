export const makeColor = function (data) {
    var hash = Array.prototype.reduce.call(data + data, function (sum, c, i) {
        return (sum * 31 + c.charCodeAt(0)) & 0xffffff;
    }, 0);

    var color = [];
    for (var i = 0; i < 3; ++i) {
        color.push(hash & 0xff);
        hash >>= 8;
    }
    color.push(1);

    return 'rgba(' + color.join(",") + ')';
};