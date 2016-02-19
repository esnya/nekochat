/* eslint global-require: 0 */

jest.autoMockOff();

describe('InputReducer', () => {
    const {
    } = require('../../constants/InputActions');
    const reducer = require('../InputReducer').inputReducer;

    let state;
    it('should be empty array initially', () => {
        state = reducer(undefined, { type: 'TEST_INIT' });
        expect(state).toEqual([]);
    });
});