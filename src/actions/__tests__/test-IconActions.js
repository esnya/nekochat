describe('IconActions', () => {
    jest.dontMock('../IconActions');
    const ACTIONS = require('../../constants/IconActions');
    const Actions = require('../IconActions');

    it('should be return type', () => {
        [
            ['create', 'CREATE', {}],
            ['remove', 'REMOVE', {}],
            ['fetch', 'FETCH'],
            ['push', 'PUSH', [{}]],
        ].forEach(([akey, ckey, ...args]) => {
            expect(Actions[akey](...args).type)
                .toEqual(ACTIONS[ckey]);
        });
    });
});
