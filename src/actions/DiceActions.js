import * as DICE from '../constants/DiceActions';

export const roll = (faces, results) => ({
    type: DICE.ROLL,
    faces,
    results,
});
