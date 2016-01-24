import { create } from '../actions/SnackActions';

export const snackMiddleware = ({dispatch}) => (next) => (action) => {
    if (action.type.match(/^SNACK_/)) return next(action);
    const {
        snack,
        ...nextAction,
    } = action;

    if (!snack) return next(action);

    dispatch(create(snack, dispatch));

    return next(nextAction);
};