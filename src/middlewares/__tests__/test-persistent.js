describe('middlewares', () => {
    describe('persitent', () => {
        jest.autoMockOff();

        const getItem = jest.fn();
        const setItem = jest.fn();
        jest.setMock('../../browser/localStorage', {
            getItem,
            setItem,
        });

        const { Map } = require('immutable');

        const persitent = require('../persistent');
        const middleware = persitent.default;

        it('saves into localStorage', () => {
            setItem.mockClear();
            const room = new Map({ id: 'room-id' });

            const getState = jest.fn()
                .mockReturnValueOnce({ test: new Map({ value: 1 }), room })
                .mockReturnValueOnce({ test: new Map({ value: 2 }), room })
                .mockReturnValueOnce({ test: new Map({ value: 2 }), room });
            const next = jest.fn();
            const action = { type: 'TEXT' };

            middleware(
                'test',
                'nekochat:${room.get("id")}:test'
            )({ getState })(next)(action);

            expect(next.mock.calls).toEqual([[action]]);
            expect(setItem.mock.calls).toEqual([[
                'nekochat:room-id:test',
                JSON.stringify({ value: 2 }),
            ]]);
        });

        it('does not save if not changed', () => {
            setItem.mockClear();

            const getState = jest.fn()
                .mockReturnValueOnce({ test: new Map({ value: 1 }) })
                .mockReturnValueOnce({ test: new Map({ value: 1 }) });
            const next = jest.fn();
            const action = { type: 'TEXT' };

            middleware('test', 'nekochat:test')({ getState })(next)(action);

            expect(next.mock.calls).toEqual([[action]]);
            expect(setItem).not.toBeCalled();
        });

        it('exposes loader utility', () => {
            getItem.mockClear();
            getItem.mockReturnValue(JSON.stringify({ value: 3 }));

            const state = persitent.load('nekochat:test');

            expect(getItem).toBeCalledWith('nekochat:test');
            expect(state).toEqual(new Map({ value: 3 }));
        });
    });
});
