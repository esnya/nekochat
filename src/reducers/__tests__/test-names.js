describe('reducers', () => {
    describe('names', () => {
        jest.autoMockOff();

        const load = jest.fn();
        jest.setMock('../../middlewares/persistent', { load });

        jest.mock('../../utility/id');
        const { genId } = require('../../utility/id');

        jest.setMock('../../browser/user', {
            id: 'user',
            name: 'User',
        });

        const { fromJS, Map, List } = require('immutable');

        const { create, update, remove } = require('../../actions/name');
        const reducer = require('../names').default;
        const { INITIAL_NAME_ID } = require('../names');

        const INITIAL_ITEM = new Map({
            id: INITIAL_NAME_ID,
            name: 'User',
        });

        let state;
        it('is List contains user name initially', () => {
            state = reducer(undefined, { type: 'INIT' });
            expect(state).toEqualImmutable(new List([INITIAL_ITEM]));
        });

        it('creates new name', () => {
            genId
                .mockReturnValueOnce('id1')
                .mockReturnValueOnce('id2');

            state = reducer(state, create({
                name: 'Test',
            }));
            state = reducer(state, create({
                name: 'Test2',
            }));

            expect(state).toEqualImmutable(new List([
                INITIAL_ITEM,
                fromJS({
                    id: 'id1',
                    name: 'Test',
                }),
                fromJS({
                    id: 'id2',
                    name: 'Test2',
                }),
            ]));
        });

        it('updates name', () => {
            state = reducer(state, update({
                id: 'id1',
                name: 'Test1',
            }));
            expect(state).toEqualImmutable(new List([
                INITIAL_ITEM,
                fromJS({
                    id: 'id1',
                    name: 'Test1',
                }),
                fromJS({
                    id: 'id2',
                    name: 'Test2',
                }),
            ]));
        });

        it('removes name', () => {
            state = reducer(state, remove({ id: 'id2' }));
            expect(state).toEqualImmutable(new List([
                INITIAL_ITEM,
                fromJS({
                    id: 'id1',
                    name: 'Test1',
                }),
            ]));

            state = reducer(state, remove({ id: INITIAL_NAME_ID }));
            expect(state).toEqualImmutable(new List([
                fromJS({
                    id: 'id1',
                    name: 'Test1',
                }),
            ]));
        });

        it('inserts default after all removed', () => {
            state = reducer(state, remove({ id: 'id1' }));
            expect(state).toEqualImmutable(new List([
                INITIAL_ITEM,
            ]));
        });

        it('resets name by join event', () => {
            load.mockClear();
            load.mockReturnValueOnce(new List([
                INITIAL_ITEM,
                fromJS({
                    id: 'id3',
                    name: 'Test3',
                }),
            ]));

            const { join } = require('../../actions/room');
            state = reducer(state, join({ id: 'room-id' }));

            expect(load.mock.calls).toEqual([[
                'nekochat:room-id:names',
                new List([INITIAL_ITEM]),
            ]]);
            expect(state).toEqualImmutable(new List([
                INITIAL_ITEM,
                fromJS({
                    id: 'id3',
                    name: 'Test3',
                }),
            ]));
        });
    });
});
