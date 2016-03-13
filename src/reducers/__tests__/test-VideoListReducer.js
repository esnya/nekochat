/* eslint global-require: 0 */

jest.autoMockOff();

describe('VideoListReducer', () => {
    // const {
    // } = require('../../constants/VideoActions');
    const reducer = require('../VideoListReducer').videoListReducer;

    let state;
    it('should be empty array initially', () => {
        state = reducer(undefined, { type: 'TEST_INIT' });
        expect(state).toEqual([]);
    });
});
