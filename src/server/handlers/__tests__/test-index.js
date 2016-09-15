describe('handlers', () => {
    jest.setMock('config', {
        get: jest.fn((path) => ({
            redis: {},
        }[path])),
    });

    const icon = require('../icon').default;
    const typing = require('../typing').default;
    const message = require('../message').default;
    const room = require('../room').default;

    jest.unmock('../index');
    const { handle } = require('../index');

    it('handles', () => {
        const handlers = [
            icon,
            typing,
            message,
            room,
        ];

        handlers.map((handler) => handler.mockImpl(
            () => (next) => (action) => next(action)
        ));

        const client = {
            room: { id: 'room1' },
            user: { id: 'user1' },
        };
        const next = jest.fn();
        const action = {
            type: 'ACTION',
        };

        handle(client)(next)(action);

        expect(next).toBeCalledWith({
            type: 'ACTION',
        });
        handlers.forEach((handler) => {
            expect(handler).toBeCalledWith(client);
        });
    });
});
