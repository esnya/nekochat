describe('DialogActions', () => {
    jest.dontMock('../DialogActions');
    const ACTIONS = require('../../constants/DialogActions');
    const Actions = require('../DialogActions');

    it('should be return type', () => {
        [
            ['open', 'OPEN', 'id', {}],
            ['close', 'CLOSE', 'id'],
        ].forEach(([akey, ckey, ...args]) => {
            expect(Actions[akey](...args).type)
                .toEqual(ACTIONS[ckey]);
        });
    });
});