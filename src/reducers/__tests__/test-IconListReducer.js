/* eslint global-require: 0 */

jest.autoMockOff();

describe('IconListReducer', () => {
    const {
    } = require('../../constants/IconActions');
    const reducer = require('../IconListReducer').iconListReducer;

    let state;
    it('should be empty array initially', () => {
        state = reducer(undefined, { type: 'TEST_INIT' });
        expect(state).toEqual([]);
    });
});