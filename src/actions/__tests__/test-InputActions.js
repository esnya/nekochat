describe('InputActions', () => {
    jest.dontMock('../InputActions');
    const ACTIONS = require('../../constants/InputActions');
    const Actions = require('../InputActions');

    it('should be return type', () => {
        [
            ['end', 'END', {}],
            ['ended', 'ENDED', {}],
            ['begin', 'BEGIN', {}],
            ['began', 'BEGAN', {}],
        ].forEach(([akey, ckey, ...args]) => {
            expect(Actions[akey](...args).type)
                .toEqual(ACTIONS[ckey]);
        });
    });
});