import * as SNACK from '../constants/SnackActions';
import { genId } from '../utility/id';

export const create = (snack) => ({
    type: SNACK.CREATE,
    snack: {
        ...snack,
        id: genId(),
    },
});

export const remove = (snack) => ({
    ...snack,
    type: SNACK.REMOVE,
});