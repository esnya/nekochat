const NUM = 31;
const MASK = 0xffffff;
const BYTEMASK = 0xff;
const CHANNELS = 3;

export const makeColor = function (data) {
    let hash = Array.reduce(
        data + data,
        (sum, c) =>  (sum * NUM + c.charCodeAt(0)) & MASK,
        0
    );
    const color = [];

    for (let i = 0; i < CHANNELS; ++i) {
        color.push(hash & BYTEMASK);
        hash >>= 8;
    }
    color.push(1);

    return 'rgba(' + color.join(",") + ')';
};