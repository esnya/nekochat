describe('reducers', () => {
    describe('ui', () => {
        jest.autoMockOff();

        const { fromJS } = require('immutable');

        const {
            drawer,
        } = require('../../actions/ui');
        const reducer = require('../ui').default;

        let state;
        it('has state of Map initially', () => {
            state = reducer(state, { type: 'INIT' });

            expect(state).toEqualImmutable(fromJS({
                drawer: false,
            }));
        });

        it('changes drawer state', () => {
            state = reducer(state, drawer(true));
            expect(state).toEqualImmutable(fromJS({
                drawer: true,
            }));

            state = reducer(state, drawer(false));
            expect(state).toEqualImmutable(fromJS({
                drawer: false,
            }));
        });

        it('closes drawer by route event', () => {
            const { set } = require('../../actions/route');

            state = reducer(state, drawer(true));
            state = reducer(state, set('/'));

            expect(state).toEqualImmutable(fromJS({
                drawer: false,
            }));
        });
    });
});
