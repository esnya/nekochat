import dice3d from 'dice3d';
import { ROLL } from '../actions/dice';
import config from '../browser/config';

let diceCounter = 0;

export default () => (next) => (action) => {
    if (action.type === ROLL) {
        const {
            faces,
            results,
        } = action.payload;

        results.forEach((result) => {
            if (diceCounter >= config.diceLimit) return;
            diceCounter++;
            dice3d(faces, result, () => diceCounter--);
        });
    }

    return next(action);
};
