describe('reducers', () => {
    describe('route', () => {
        jest.autoMockOff();

        const { fromJS }  = require('immutable');

        const { set } = require('../../actions/route');
        const reducer = require('../route').default;

        let state;
        it('is sets route', () => {
            const action = set('/path');
            action.payload.route = {
                path: '/path',
                handler: 'room',
                params: { id: 'path' },
            };

            state = reducer(state, action);

            expect(state).toEqualImmutable(fromJS({
                path: '/path',
                handler: 'room',
                params: { id: 'path' },
            }));
        });
    });
});
