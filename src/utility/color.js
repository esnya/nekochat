import crypto from 'crypto';
import space from 'color-space';
import User from '../browser/user';

const SCALE_Y = 0.5;
const OFFSET_Y = 0.2;
const OFFSET_UV = -0.5;

export const makeColor = function (data) {
    const hash = crypto
        .createHash('sha256')
        .update(data)
        .digest();

    const yuv = [
        hash[0] / 255 * SCALE_Y + OFFSET_Y,
        hash[1] / 255 + OFFSET_UV,
        hash[2] / 255 + OFFSET_UV,
    ];

    const rgb = space
        .yuv
        .rgb(yuv)
        .map((a) => Math.round(a));

    return 'rgb(' + rgb.join(",") + ')';
};

/**
 * Get color of name
 * @param{string} name - Name
 * @param{string} user_id - User ID
 * @returns{string} color
 */
export function nameColor(name, user_id = User.id) {
    return makeColor(`${name}${user_id}`);
}
