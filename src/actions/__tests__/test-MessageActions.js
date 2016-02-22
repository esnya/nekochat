describe('MessageActions', () => {
    jest.dontMock('../MessageActions');
    const ACTIONS = require('../../constants/MessageActions');
    const Actions = require('../MessageActions');

    it('should be return type', () => {
        [
            ['create', 'CREATE', {}],
            ['update', 'UPDATE', {}],
            ['fetch', 'FETCH'],
            ['fetch', 'FETCH'],
            ['push', 'PUSH', {id: 'id'}],
            ['requestPast', 'REQUEST_PAST', 10],
            ['prependList', 'PREPEND_LIST', []],
        ].forEach(([akey, ckey, ...args]) => {
            expect(Actions[akey](...args).type)
                .toEqual(ACTIONS[ckey]);
        });
    });
});
