export const makeColor = function (data) {
    let hash = Array.reduce(
        data + data,
        (sum, c) =>  (sum * 31 + c.charCodeAt(0)) & 0xffffff,
        0
    );
    let color = [];

    for (let i = 0; i < 3; ++i) {
        color.push(hash & 0xff);
        hash >>= 8;
    }
    color.push(1);

    return 'rgba(' + color.join(",") + ')';
};