jest.autoMockOff();

describe('NotificationReducer', () => {
    const Notification = require('../../actions/NotificationActions');
    const reducer = require('../NotificationReducer').notifications;

    let state;
    it('should be array initially', () => {
        state = reducer(state, {
            type: 'TEST_INIT',
        });

        expect(state).toEqual([]);
    });

    it('should be able to append notifications', () => {
        state = reducer(state, Notification.notify({
            message: 'Test Message 1',
        }));

        state = reducer(state, Notification.notify({
            message: 'Test Message 2',
        }));

        expect(state.map((n) => n.message)).toEqual([
            'Test Message 2',
            'Test Message 1',
        ]);
    });

    it('should be able to remove notifications', () => {
        state = reducer(state, Notification.close(state[1].id));
        expect(state.map((n) => n.message)).toEqual([
            'Test Message 2',
        ]);

        state = reducer(state, Notification.close(state[0].id));
        expect(state).toEqual([]);
    });
});
