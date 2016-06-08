describe('reducers', () => {
    describe('dialogs', () => {
        jest.autoMockOff();

        jest.mock('../../utility/id');
        const { genId } = require('../../utility/id');

        const Immutable = require('immutable');
        const { fromJS } = Immutable;


        const { open, ok, close } = require('../../actions/dialog');
        const reducer = require('../dialogs').default;

        let state;
        it('has state of empty List', () => {
            state = reducer(undefined, {type: 'TEST_INIT'});
            expect(state).isEmpty();
        });

        it('shifts by new opened dialog', () => {
            genId.mockReturnValue(1);
            state = reducer(state, open('alert', {opt: 'ions'}));

            expect(state).toEqualImmutable(fromJS([
                {
                    id: 1,
                    type: 'alert',
                    opt: 'ions',
                },
            ]));

            genId.mockReturnValue(2);
            state = reducer(state, open('alert', {opt: 'ions'}));

            expect(state).toEqualImmutable(fromJS([
                {
                    id: 2,
                    type: 'alert',
                    opt: 'ions',
                },
                {
                    id: 1,
                    type: 'alert',
                    opt: 'ions',
                },
            ]));
        });

        it('removes closed dialog', () => {
            state = reducer(state, ok(1));
            expect(state).toEqualImmutable(fromJS([
                {
                    id: 2,
                    type: 'alert',
                    opt: 'ions',
                },
            ]));

            state = reducer(state, close(2));
            expect(state).toEqualImmutable(fromJS([]));
        });
    });
});
