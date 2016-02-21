describe('NotificationMiddleware', () => {
    jest.dontMock('../../actions/NotificationActions');
    const Notification = require('../../actions/NotificationActions');

    const NOTIFICATION = require('../../constants/NotificationActions');

    jest.dontMock('../NotificationMiddleware');
    const middleware =
        require('../NotificationMiddleware').notificationMiddleware;

    const next = jest.genMockFn();
    const store = {
        dispatch: jest.genMockFn(),
        getStore: jest.genMockFn(),
    };
    beforeEach(() => {
        next.mockClear();
        store.dispatch.mockClear();
        store.getStore.mockClear();
    });

    it('should close notification after timeout', () => {
        middleware(store)(next)(Notification.notify({
            message: 'Test Notification',
            duration: 1000,
        }));

        expect(store.dispatch).not.toBeCalled();

        const id = next.mock.calls[0][0].notification.id;
        expect(id).toBeDefined();
        expect(id).not.toBeNull();

        expect(setTimeout.mock.calls[0][1]).toBe(1000);
        setTimeout
            .mock
            .calls[0][0]();

        expect(store.dispatch).toBeCalledWith({
            type: NOTIFICATION.CLOSE,
            id,
        });
    });

    it('should notify by an action with notification', () => {
        middleware(store)(next)({
            type: 'TEAT_ACTION',
            some: 'data',
            notify: {
                message: 'Test Notification',
            },
        });

        setTimeout
            .mock
            .calls[0][0]();

        expect(store.dispatch.mock.calls.length).toBe(1);
        const action = store.dispatch.mock.calls[0][0];
        expect(action.type).toEqual(NOTIFICATION.NOTIFY);
        expect(action.notification.message).toEqual('Test Notification');
        expect(action.notification.id).toBeDefined();
        expect(action.notification.id).not.toBeNull();
        expect(action.notification.data).toEqual({
            type: 'TEAT_ACTION',
            some: 'data',
        });

        expect(next.mock.calls.length).toBe(1);
        const nextAction = next.mock.calls[0][0];
        expect(nextAction).toEqual({
            type: 'TEAT_ACTION',
            some: 'data',
        });
    });
});