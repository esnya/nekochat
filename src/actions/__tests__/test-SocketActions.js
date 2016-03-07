describe('SocketActions', () => {
    jest.dontMock('../SocketActions');
    const ACTIONS = require('../../constants/SocketActions');
    const Actions = require('../SocketActions');

    it('should be return type', () => {
        [
            ['connect', 'CONNECT'],
            ['disconnect', 'DISCONNECT'],
        ].forEach(([akey, ckey, ...args]) => {
            expect(Actions[akey](...args).type)
                .toEqual(ACTIONS[ckey]);
        });
    });
});
