/* eslint global-require: 0 */

jest.autoMockOff();

describe('DOMReducer', () => {
    const {
        FOCUS,
        BLUR,
    } = require('../../constants/DOMActions');
    const {
        domReducer,
    } = require('../DOMReducer');

    let state;
    it('should be object', () => {
        state = domReducer(undefined, { type: 'TEST_INIT' });
        expect(typeof(state)).toEqual('object');
    });

    it('initially should be focused', () => {
        expect(state.focused).toBe(true);
    });

    it('should be unfocused after blur', () => {
        state = domReducer(state, {
            type: BLUR,
        });
        expect(state.focused).toBe(false);
    });

    it('should be focused after focus', () => {
        state = domReducer(state, {
            type: FOCUS,
        });
        expect(state.focused).toBe(true);
    });
});