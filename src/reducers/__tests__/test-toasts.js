describe('reducers', () => {
    describe('toasts', () => {
        jest.autoMockOff();

        jest.mock('../../utility/id');
        const { genId } = require('../../utility/id');

        const { fromJS } = require('immutable');

        const { create, remove } = require('../../actions/toast');
        const reducer = require('../toasts').default;

        let state;
        it('is empty List initially', () => {
            state = reducer(undefined, { type: 'INIT' });
            expect(state).isEmpty();
        });

        it('appends new toast', () => {
            genId.mockReturnValueOnce(1);
            state = reducer(state, create({
                message: 'Toast',
            }));
            expect(state).toEqualImmutable(fromJS([
                {
                    id: 1,
                    message: 'Toast',
                },
            ]));

            genId.mockReturnValueOnce(2);
            state = reducer(state, create({
                message: 'Toast',
            }));
            expect(state).toEqualImmutable(fromJS([
                {
                    id: 1,
                    message: 'Toast',
                },
                {
                    id: 2,
                    message: 'Toast',
                },
            ]));
        });

        it('removes toast', () => {
            state = reducer(state, remove({ id: 2 }));
            expect(state).toEqualImmutable(fromJS([
                {
                    id: 1,
                    message: 'Toast',
                },
            ]));

            state = reducer(state, remove({ id: 1 }));
            expect(state).isEmpty();
        });
    });
});
