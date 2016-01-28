import * as DOM from '../constants/DOMActions';

let initialized = false;

export const domMiddleware = ({dispatch}) => (next) => (action) => {
    if (!initialized) {
        initialized = true;

        Object.keys(DOM)
            .forEach((key) => {
                window.addEventListener(
                    key.toLowerCase(),
                    () => dispatch({type: DOM[key]})
                );
            });
    }

    return next(action);
};