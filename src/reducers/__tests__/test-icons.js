describe('reducers', () => {
    describe('icons', () => {
        jest.autoMockOff();

        const Immutable = require('immutable');
        const { fromJS } = Immutable;

        const {
            create,
            list,
            remove,
            bulkRemove,
        } = require('../../actions/icon');
        const reducer = require('../icons').default;

        let state;
        it('has state of empty List initially', () => {
            state = reducer(undefined, {type: 'TEST_INIT'});
            expect(state).isEmpty();
        });

        it('prepends created icon which has id', () => {
            state = reducer(state, create({
                id: 'id1',
                type: 'image/png',
            }));
            state = reducer(state, create({
                type: 'image/png',
            }));
            state = reducer(state, create({
                id: 'id2',
                type: 'image/gif',
            }));

            expect(state).toEqualImmutable(fromJS([
                {
                    id: 'id2',
                    type: 'image/gif',
                },
                {
                    id: 'id1',
                    type: 'image/png',
                },
            ]));
        });

        it('removes icon', () => {
            state = reducer(state, create({
                id: 'id3',
                type: 'image/gif',
            }));
            state = reducer(state, remove({
                id: 'id2',
            }));

            expect(state).toEqualImmutable(fromJS([
                {
                    id: 'id3',
                    type: 'image/gif',
                },
                {
                    id: 'id1',
                    type: 'image/png',
                },
            ]));
        });

        it('removes icons in bulk', () => {
            state = reducer(state, create({
                id: 'id4',
                type: 'image/gif',
            }));
            state = reducer(state, create({
                id: 'id5',
                type: 'image/gif',
            }));
            state = reducer(state, bulkRemove([
                { id: 'id1' },
                { id: 'id3' },
                { id: 'id5' },
            ]));

            expect(state).toEqualImmutable(fromJS([
                {
                    id: 'id4',
                    type: 'image/gif',
                },
            ]));
        });

        it('resets by list', () => {
            state = reducer(state, list([
                {
                    id: 'id7',
                    type: 'image/gif',
                },
                {
                    id: 'id8',
                    type: 'image/bmp',
                },
                {
                    id: 'id9',
                    type: 'image/png',
                },
            ]));

            expect(state).toEqualImmutable(fromJS([
                {
                    id: 'id7',
                    type: 'image/gif',
                },
                {
                    id: 'id8',
                    type: 'image/bmp',
                },
                {
                    id: 'id9',
                    type: 'image/png',
                },
            ]));
        });
    });
});
