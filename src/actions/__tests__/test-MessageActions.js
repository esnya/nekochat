describe('MessageActions', () => {
    jest.dontMock('../MessageActions');
    const ACTIONS = require('../../constants/MessageActions');
    const Actions = require('../MessageActions');

    it('should be return type', () => {
        [
            ['create', 'CREATE', {}],
            ['update', 'UPDATE', {}],
            ['fetch', 'FETCH'],
            ['fetch', 'FETCH', 'id'],
            ['push', 'PUSH', {id: 'id'}],
        ].forEach(([akey, ckey, ...args]) => {
            expect(Actions[akey](...args).type)
                .toEqual(ACTIONS[ckey]);
        });
    });
});