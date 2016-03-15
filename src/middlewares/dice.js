import dice3d from 'dice3d';
import {ROLL} from '../constants/DiceActions';

const DICE_MAX = 20;
let diceCounter = 0;

export const dice = () => (next) => (action) => {
    if (action.type === ROLL) {
        const {
            faces,
            results,
        } = action;

        results.forEach((result) => {
            if (diceCounter > DICE_MAX) return;
            diceCounter++;
            dice3d(faces, result, () => diceCounter--);
        });
    }

    return next(action);
};
