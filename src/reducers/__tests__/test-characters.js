describe('reducers', () => {
    describe('character', () => {
        jest.autoMockOff();

        jest.mock('../../browser/character');
        const character = require('../../browser/character');
        const { fromJS } = require('immutable');

        const { get } = require('../../actions/character');
        const reducer = require('../characters').default;

        let state;
        it('has state of empty Map initially', () => {
            state = reducer(undefined, { type: 'TEST_INIT' });
            expect(state).toBeImmutable();
            expect(state).isEmpty();
        });

        it('gets character from url', () => {
            character.get.mockReturnValue({
                url: 'url',
                data: 'data',
            });

            state = reducer(state, get('url'));

            expect(state).toEqualImmutable(fromJS({
                url: {
                    url: 'url',
                    data: 'data',
                },
            }));
        });
    });
});
