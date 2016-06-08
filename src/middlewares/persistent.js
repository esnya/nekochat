import Immutable, { fromJS } from 'immutable';
import { template } from 'lodash';
import localStorage from '../browser/localStorage';

export default (stateKey, storageKey) =>
    ({ getState }) => (next) => (action) => {
        const prev = getState()[stateKey];

        // eslint-disable-next-line callback-return
        const result = next(action);

        const state = getState()[stateKey];

        if (!Immutable.is(prev, state)) {
            localStorage.setItem(
                template(storageKey)(getState()),
                JSON.stringify(state.toJS())
            );
        }

        return result;
    };

/**
 * Load inital state from localStorage
 * @param{string} storageKey - Key in localStorage
 * @param{string} initialValue - Initial value
 * @returns{Iterable} Initial state
 */
export function load(storageKey, initialValue) {
    const item = localStorage.getItem(storageKey);

    if (!item) return initialValue;

    return fromJS(JSON.parse(item));
}
