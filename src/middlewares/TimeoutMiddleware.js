export const timeoutMiddleware = ({dispatch}) => (next) => (action) => {
    const {
        timeout,
    } = action;

    if (timeout && timeout.next) {
        setTimeout(() => dispatch(timeout.next), timeout.timeout);
    }

    return next(action);
};
