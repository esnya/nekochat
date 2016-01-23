import * as Confirm from '../../actions/ConfirmActions';
import * as CONFIRM from '../../constants/ConfirmActions';

export const confirmMiddleWare = ({dispatch, getState})=>
    (next) => (action) => {
        if (action.type === CONFIRM.OK) {
            const confirm = getState().confirmList
                .find((c) => c.id === action.id);

            if (confirm && confirm.next) dispatch(confirm.next);
        }

        if (!action.confirm) return next(action);

        const {
            confirm,
            ...nextAction,
        } = action;

        return next(Confirm.create({
            ...confirm,
            next: nextAction,
        }));
    };