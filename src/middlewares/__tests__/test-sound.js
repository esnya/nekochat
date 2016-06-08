describe('middlewares', () => {
    describe('sound', () => {
        const { notice } = require('../../browser/sound');

        jest.unmock('../sound');
        const sound = require('../sound').default;

        it('plays sound of notice', () => {
            const action = {
                type: 'TEXT',
                payload: {},
                meta: {
                    sound: 'notice',
                    meta: 'meta',
                },
            };
            const next = jest.fn();

            sound({})(next)(action);

            expect(next.mock.calls).toEqual([[action]]);
            expect(notice.mock.calls.length).toBe(1);
        });
    });
});
