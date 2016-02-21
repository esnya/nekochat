/* eslint global-require: 0 */

jest.autoMockOff();

describe('MessageListReducer', () => {
    // require('../../constants/MessageActions');
    const reducer = require('../MessageListReducer').messageListReducer;

    let state;
    it('should be empty array initially', () => {
        state = reducer(undefined, { type: 'TEST_INIT' });
        expect(state).toEqual([]);
    });
});