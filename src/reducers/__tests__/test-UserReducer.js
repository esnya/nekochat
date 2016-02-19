/* eslint global-require: 0 */

jest.autoMockOff();

describe('UserReducer', () => {
    const {
    } = require('../../constants/UserActions');
    const reducer = require('../UserReducer').userReducer;

    let state;
    it('should be null initially', () => {
        state = reducer(undefined, { type: 'TEST_INIT' });
        expect(state).toBeNull();
    });
});