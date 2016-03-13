describe('VideoActions', () => {
    jest.dontMock('../VideoActions');
    const ACTIONS = require('../../constants/VideoActions');
    const Actions = require('../VideoActions');

    it('should be return type', () => {
        [
            ['create', 'CREATE'],
            ['created', 'CREATED', 'id'],
            ['push', 'PUSH', 'id'],
            ['request', 'REQUEST', 'to', 'callme'],
            ['requested', 'REQUESTED', 'to', 'callme'],
            ['remove', 'REMOVE', 'id'],
            ['removed', 'REMOVED', 'id'],
            ['end', 'END'],
        ].forEach(([akey, ckey, ...args]) => {
            expect(Actions[akey](...args).type)
                .toEqual(ACTIONS[ckey]);
        });
    });
});
