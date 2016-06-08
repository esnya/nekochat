describe('middlewares', () => {
    describe('confirm', () => {
        jest.unmock('redux-actions');
        jest.unmock('redux-actions/lib/createAction');

        const { genId } = require('../../utility/id');

        jest.unmock('immutable');
        const { List, Map } = require('immutable');

        jest.unmock('../../actions/dialog');
        const { OPEN, ok } = require('../../actions/dialog');

        jest.unmock('../dialog');
        const middleware = require('../dialog').default;

        it('opens dialog by meta.dialog', () => {
            const dispatch = jest.fn();
            const next = jest.fn();
            const action = {
                type: 'ANY_ACTION',
                payload: {some: 'data'},
                meta: {
                    dialog: {
                        type: 'confirm',
                        title: 'test confirm',
                        message: 'message',
                    },
                    another: 'meta',
                },
            };

            genId.mockReturnValueOnce(1);

            middleware({ dispatch })(next)(action);

            expect(next.mock.calls).toEqual([[{
                type: OPEN,
                payload: {
                    id: 1,
                    title: 'test confirm',
                    type: 'confirm',
                    message: 'message',
                    next: {
                        type: 'ANY_ACTION',
                        payload: { some: 'data' },
                        meta: { another: 'meta' },
                    },
                },
            }]]);
            expect(dispatch.mock.calls).toEqual([]);
        });

        it('dispatches next action by OK', () => {
            const nextAction = {
                type: 'NEXT_ACTION',
                payload: { some: 'data' },
                meta: { meta: 'data' },
            };
            const dispatch = jest.fn();
            const getState = jest.fn().mockReturnValue({
                dialogs: new List([
                    new Map({
                        id: 'another-id',
                        next: {},
                    }),
                    new Map({
                        id: 'id',
                        next: nextAction,
                    }),
                ]),
            });
            const next = jest.fn();
            const action = ok('id');

            middleware({ dispatch, getState })(next)(action);

            expect(next.mock.calls).toEqual([[action]]);
            expect(dispatch.mock.calls).toEqual([[nextAction]]);
        });
    });
});
