describe('middlewares', () => {
    describe('socket', () => {
        const socket = {
            emit: jest.fn(),
        };
        jest.setMock('../../browser/socket', socket);

        jest.unmock('../socket');
        const middleware = require('../socket').default;

        it('emits action through socket', () => {
            const next = jest.fn();
            const action = {
                type: 'TEST',
                payload: 'payload',
                meta: {
                    oter: 'meta',
                    sync: true,
                },
            };

            middleware({})(next)(action);

            expect(socket.emit.mock.calls).toEqual([['action', action]]);
            expect(next.mock.calls).toEqual([[action]]);
        });
    });
});
