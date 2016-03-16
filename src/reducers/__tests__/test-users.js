describe('reducers/users', () => {
    jest.unmock('../users');
    const reducer = require('../users').users;

    let state;
    it('should be empty array initially', () => {
        state = reducer(undefined, { type: 'TEST_INIT' });
        expect(state).toEqual([]);
    });
});
