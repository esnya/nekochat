describe('UserActions', () => {
    jest.dontMock('../UserActions');
    const ACTIONS = require('../../constants/UserActions');
    const Actions = require('../UserActions');

    it('should be return type', () => {
        [
            ['loggedin', 'LOGGEDIN', {}],
        ].forEach(([akey, ckey, ...args]) => {
            expect(Actions[akey](...args).type)
                .toEqual(ACTIONS[ckey]);
        });
    });
});