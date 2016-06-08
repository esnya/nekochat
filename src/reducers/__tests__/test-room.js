describe('reducers', () => {
    describe('room', () => {
        jest.autoMockOff();

        const Immutable = require('immutable');
        const { fromJS } = Immutable;

        const { update, join, leave } = require('../../actions/room');
        const reducer = require('../room').default;

        let state;
        it('is empty Map initially', () => {
            state = reducer(undefined, { type: 'INIT' });
            expect(state).isEmpty();
        });

        it('is updated by join', () => {
            state = reducer(state, join({
                id: 'id1',
                title: 'Title1',
                password: false,
            }));
            expect(state).toEqualImmutable(fromJS({
                id: 'id1',
                title: 'Title1',
                password: false,
            }));
        });

        it('is updateable', () => {
            state = reducer(state, update({
                title: 'Title2',
                password: 'password',
            }));
            expect(state).toEqualImmutable(fromJS({
                id: 'id1',
                title: 'Title2',
                password: true,
            }));
        });

        it('is reset by leaving', () => {
            state = reducer(state, leave());
            expect(state).isEmpty();
        });
    });
});
