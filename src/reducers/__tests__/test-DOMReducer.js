/* eslint global-require: 0 */

jest.autoMockOff();

describe('DOMReducer', () => {
    const {
        FOCUS,
        BLUR,
    } = require('../../constants/DOMActions');
    const {
        dom,
    } = require('../DOMReducer');

    let state;
    it('should be object', () => {
        state = dom(undefined, { type: 'TEST_INIT' });
        expect(typeof(state)).toEqual('object');
    });

    it('initially should be focused', () => {
        expect(state.focused).toBe(true);
    });

    it('should be unfocused after blur', () => {
        state = dom(state, {
            type: BLUR,
        });
        expect(state.focused).toBe(false);
    });

    it('should be focused after focus', () => {
        state = dom(state, {
            type: FOCUS,
        });
        expect(state.focused).toBe(true);
    });
});
