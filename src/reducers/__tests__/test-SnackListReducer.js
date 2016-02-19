/* eslint global-require: 0 */

jest.autoMockOff();

describe('SnackListReducer', () => {
    const {
    } = require('../../constants/SnackActions');
    const reducer = require('../SnackListReducer').snackListReducer;

    let state;
    it('should be empty array initially', () => {
        state = reducer(undefined, { type: 'TEST_INIT' });
        expect(state).toEqual([]);
    });
});