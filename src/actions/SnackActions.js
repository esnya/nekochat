import * as SNACK from '../constants/SnackActions';
import { genId } from '../utility/id';

export const create = (snack, dispatch = null) => ({
    type: SNACK.CREATE,
    snack: {
        ...snack,
        onAction: dispatch && snack.next
            ? () => dispatch(snack.next)
            : snack.onAction,
        id: genId(),
    },
});

export const remove = (snack) => ({
    ...snack,
    type: SNACK.REMOVE,
});