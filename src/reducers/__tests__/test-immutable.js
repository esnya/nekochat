describe('reducers', () => {
    describe('immutable', () => {
        jest.autoMockOff();
        const reducer = require('../immutable').default;

        it('has passed initial state', () => {
            const initial = {};
            const state = reducer(initial)(undefined, { type: 'INIT' });

            expect(state).toBe(initial);
        });
    });
});
