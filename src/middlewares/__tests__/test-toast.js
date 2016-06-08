describe('middlewares', () => {
    describe('toast', () => {
        jest.unmock('redux-actions');
        jest.unmock('redux-actions/lib/createAction');

        const {genId} = require('../../utility/id');

        jest.unmock('../../actions/toast');
        const { create, remove } = require('../../actions/toast');

        jest.unmock('../toast');
        const middleware = require('../toast').default;

        it('closes after duration', () => {
            genId.mockReturnValue('id');

            const dispatch = jest.fn();
            const next = jest.fn();
            const action = create({
                duration: 3000,
            });

            middleware({ dispatch })(next)(action);

            expect(dispatch).not.toBeCalled();
            expect(next).toBeCalledWith(action);

            expect(setTimeout.mock.calls[0][1]).toBe(3000);

            setTimeout.mock.calls[0][0]();

            expect(dispatch).toBeCalledWith(remove(action.payload.id));
        });

        it('creates toast from meta', () => {
            const dispatch = jest.fn();
            const next = jest.fn();
            const action = {
                type: 'ANOTHER_ACTION',
                payload: {pay: 'load'},
                meta: {
                    toast: {message: 'message'},
                    me: 'ta',
                },
            };

            middleware({dispatch})(next)(action);

            expect(dispatch).toBeCalledWith(create(action.meta.toast));
            expect(next).toBeCalledWith(action);
        });
    });
});
