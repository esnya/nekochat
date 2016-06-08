describe('middlewares', () => {
    describe('dice', () => {
        jest.unmock('redux-actions');
        jest.unmock('redux-actions/lib/createAction');

        const dice3d = require('dice3d');

        jest.setMock('../../browser/config', {
            diceLimit: 20,
        });

        jest.unmock('../../actions/dice');
        const {roll} = require('../../actions/dice');

        jest.unmock('../dice');
        const middleware = require('../dice').default;

        it('rolls dice', () => {
            const callbacks = [];
            dice3d.mockImpl((f, r, c) => callbacks.push(c));

            const next = jest.fn();
            const action = roll(6, [3]);

            middleware({})(next)(action);

            const filterCalls = (call) => call.slice(0, 2);

            expect(dice3d.mock.calls.map(filterCalls)).toEqual([[6, 3]]);

            for (let i = 0; i < 30; i++) {
                middleware({})(next)(action);
            }

            expect(dice3d.mock.calls.length).toBe(20);

            callbacks.forEach((callback) => callback());

            dice3d.mockClear();

            middleware({})(next)(action);
            expect(dice3d.mock.calls.map(filterCalls)).toEqual([[6, 3]]);
        });
    });
});
