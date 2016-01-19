import crypto from 'crypto';
import space from 'color-space';

const SCALE_Y = 0.2;
const OFFSET_Y = 0.2;
const OFFSET_UV = -0.5;

export const makeColor = function (data) {
    const hash = crypto.createHash('sha256').update(data).digest();

    const yuv = [
        hash[0] / 255 * SCALE_Y + OFFSET_Y,
        hash[1] / 255 + OFFSET_UV,
        hash[2] / 255 + OFFSET_UV,
    ];

    const rgb = space.yuv.rgb(yuv).map((a) => Math.round(a));

    return 'rgb(' + rgb.join(",") + ')';
};