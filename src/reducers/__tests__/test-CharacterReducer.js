/* eslint global-require: 0 */

jest.autoMockOff();

describe('CharacterReducer', () => {
    // require('../../constants/CharacterActions');
    const reducer = require('../CharacterReducer').characters;

    let state;
    it('should be object initially', () => {
        state = reducer(undefined, { type: 'TEST_INIT' });
        expect(state).toEqual({});
    });
});
