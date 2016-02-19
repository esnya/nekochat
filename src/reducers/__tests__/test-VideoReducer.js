/* eslint global-require: 0 */

jest.autoMockOff();

describe('VideoReducer', () => {
    const {
    } = require('../../constants/VideoActions');
    const reducer = require('../VideoReducer').videoReducer;

    let state;
    it('should be null initially', () => {
        state = reducer(undefined, { type: 'TEST_INIT' });
        expect(state).toBeNull();
    });
});