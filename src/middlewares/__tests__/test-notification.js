describe('middlewares', () => {
    describe('notification', () => {
        jest.unmock('immutable');
        const { Map } = require('immutable');

        const { notify } = require('../../browser/notification');
        const close = jest.fn();
        notify.mockReturnValue(Promise.resolve({ close }));

        jest.unmock('../notification');
        const middleware = require('../notification').default;

        it('ignore actions without meta', () => {
            const getState = jest.fn();
            const next = jest.fn();
            const action = { type: 'TEST' };

            middleware({ getState })(next)(action);

            expect(getState).not.toBeCalled();
            expect(next.mock.calls).toEqual([[action]]);
        });

        it('notifies meta.notify', () => {
            const getState = jest.fn().mockReturnValue({
                dom: new Map({ focused: false }),
                title: 'foobar',
            });
            const next = jest.fn();
            const action = {
                type: 'TEST',
                payload: {
                    data: {test: 1234},
                },
                meta: {
                    notify: {
                        title: '${state.title}',
                        body: 'Message with data: ${action.payload.data.test}',
                    },
                },
            };

            middleware({ getState })(next)(action);

            expect(notify.mock.calls).toEqual([[{
                title: 'foobar',
                body: 'Message with data: 1234',
            }]]);
            expect(next.mock.calls).toEqual([[action]]);
        });

        it('ignore actions if window is not focused', () => {
            const getState = jest.fn().mockReturnValue({
                dom: new Map({ focused: true }),
            });
            const next = jest.fn();
            const action = {
                type: 'TEST',
                payload: {
                    data: {test: 1234},
                },
                meta: {
                    notify: {
                        title: '${state.title}',
                        body: 'Message with data: ${action.payload.data.test}',
                    },
                },
            };

            notify.mockClear();
            middleware({ getState })(next)(action);

            expect(notify).not.toBeCalled();
            expect(next.mock.calls).toEqual([[action]]);
        });

        it('notifies with force option', () => {
            const getState = jest.fn().mockReturnValue({
                dom: new Map({ focused: true }),
            });
            const next = jest.fn();
            const action = {
                type: 'TEST',
                payload: {
                    data: {test: 1234},
                },
                meta: {
                    notify: {
                        force: true,
                        title: 'title',
                        body: 'body',
                    },
                },
            };

            notify.mockClear();
            middleware({ getState })(next)(action);

            expect(notify).toBeCalledWith({
                force: true,
                title: 'title',
                body: 'body',
            });
            expect(next.mock.calls).toEqual([[action]]);
        });
    });
});
