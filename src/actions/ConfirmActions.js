import * as CONFIRM from '../constants/ConfirmActions';
import { genId } from '../utility/id';

export const create = (confirm) => ({
    type: CONFIRM.CREATE,
    confirm: {
        ...confirm,
        id: genId(),
    },
});

export const ok = (id) => ({
    type: CONFIRM.OK,
    id,
});
export const cancel = (id) => ({
    type: CONFIRM.CANCEL,
    id,
});