describe('reducers', () => {
    describe('users', () => {
        jest.autoMockOff();

        const Immutable = require('immutable');
        const { fromJS } = Immutable;

        const { list } = require('../../actions/user');
        const reducer = require('../users').default;

        let state;
        it('is reset by list', () => {
            state = reducer(state, list([
                { id: 'u1', name: 'User1' },
                { id: 'u2', name: 'User2' },
                { id: 'u3', name: 'User3' },
            ]));
            expect(state).toEqualImmutable(fromJS([
                { id: 'u1', name: 'User1' },
                { id: 'u2', name: 'User2' },
                { id: 'u3', name: 'User3' },
            ]));
        });
    });
});
