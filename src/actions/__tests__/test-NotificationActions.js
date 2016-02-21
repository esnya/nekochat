describe('NotificationActions', () => {
    jest.dontMock('../NotificationActions');
    const ACTIONS = require('../../constants/NotificationActions');
    const Actions = require('../NotificationActions');

    it('should be return type', () => {
        [
            ['notify', 'NOTIFY', { message: 'notify' }],
            ['close', 'CLOSE', 0],
        ].forEach(([akey, ckey, ...args]) => {
            expect(Actions[akey](...args).type)
                .toEqual(ACTIONS[ckey]);
        });
    });
});