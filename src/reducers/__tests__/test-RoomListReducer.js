/* eslint global-require: 0 */

jest.autoMockOff();

describe('RoomListReducer', () => {
    const {
    } = require('../../constants/RoomActions');
    const reducer = require('../RoomListReducer').roomListReducer;

    let state;
    it('should be empty array initially', () => {
        state = reducer(undefined, { type: 'TEST_INIT' });
        expect(state).toEqual([]);
    });
});