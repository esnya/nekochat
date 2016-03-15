describe('DiceActions', () => {
    jest.dontMock('../DiceActions');
    const ACTIONS = require('../../constants/DiceActions');
    const Actions = require('../DiceActions');

    it('should be return type', () => {
        [
            ['roll', 'ROLL', 6, 2],
        ].forEach(([akey, ckey, ...args]) => {
            expect(Actions[akey](...args).type)
                .toEqual(ACTIONS[ckey]);
        });
    });
});
