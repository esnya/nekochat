describe('reducers', () => {
    describe('rooms', () => {
        jest.autoMockOff();

        const Immutable = require('immutable');
        const { fromJS, List } = Immutable;

        const { create, remove, list } = require('../../actions/room');
        const reducer = require('../rooms').default;

        let state;
        it('is empty List initially', () => {
            state = reducer(undefined, { type: 'INIT' });
            expect(state).toEqualImmutable(new List());
        });

        it('prepends new room', () => {
            state = reducer(state, create({
                title: 'No-ID',
            }));
            state = reducer(state, create({
                id: 'room1',
                title: 'room1',
            }));
            state = reducer(state, create({
                id: 'room2',
                title: 'room2',
            }));

            expect(state).toEqualImmutable(fromJS([
                {
                    id: 'room2',
                    title: 'room2',
                },
                {
                    id: 'room1',
                    title: 'room1',
                },
            ]));
        });

        it('removes room', () => {
            state = reducer(state, remove({
                id: 'room1',
            }));
            expect(state).toEqualImmutable(fromJS([
                {
                    id: 'room2',
                    title: 'room2',
                },
            ]));
        });

        it('overrided by list', () => {
            state = reducer(state, list([
                {
                    id: 'room3',
                    title: 'room3',
                },
                {
                    id: 'room4',
                    title: 'room4',
                },
            ]));
            expect(state).toEqualImmutable(fromJS([
                {
                    id: 'room3',
                    title: 'room3',
                },
                {
                    id: 'room4',
                    title: 'room4',
                },
            ]));
        });
    });
});
