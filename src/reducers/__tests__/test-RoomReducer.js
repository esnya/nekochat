/* eslint global-require: 0 */

jest.autoMockOff();

describe('RoomReducer', () => {
    // require('../../constants/RoomActions');
    const reducer = require('../RoomReducer').roomReducer;

    let state;
    it('should be null initially', () => {
        state = reducer(undefined, { type: 'TEST_INIT' });
        expect(state).toBeNull();
    });
});