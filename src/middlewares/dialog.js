import { open, OK } from '../actions/dialog';

export default ({ dispatch, getState }) => (next) => (action) => {
    if (action.type === OK) {
        const id = action.payload;
        const dialog = getState()
            .dialogs
            .find((d) => d.get('id') === id);
        const nextAction = dialog.get('next');

        dispatch(nextAction);
    }

    if (!action.meta || !action.meta.dialog) return next(action);

    const {
        dialog,
        ...meta,
    } = action.meta;

    return next(open(dialog.type, {
        ...dialog,
        next: {
            ...action,
            meta,
        },
    }));
};
