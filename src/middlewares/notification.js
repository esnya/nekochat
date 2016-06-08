import { template, transform } from 'lodash';
import { notify } from '../browser/notification';

export default ({ getState }) => (next) => (action) => {
    if (!action.meta || !action.meta.notify) return next(action);

    const force = action.meta.notify.force;

    const state = getState();
    if (!force && state.dom.get('focused')) return next(action);

    const message = transform(
        action.meta.notify,
        (result, value, key) => {
            result[key] = typeof(value) === "string"
                ? template(value)({ action, state })
                : value;
        },
        {}
    );

    notify(message).then(
        (notification) => setTimeout(() => notification.close(), 5000)
    );

    return next(action);
};
