/* eslint global-require: 0 */

jest.autoMockOff();

describe('MessageFormReducer', () => {
    // require('../../constants/MessageFormActions');
    const reducer = require('../MessageFormReducer').messageFormReducer;

    let state;
    it('should be empty array initially', () => {
        state = reducer(undefined, { type: 'TEST_INIT' });
        expect(state).toEqual([]);
    });
});
