describe('ConfirmActions', () => {
    it('should be return type', () => {
        jest.dontMock('../ConfirmActions');
        const ACTIONS = require('../../constants/ConfirmActions');
        const Actions = require('../ConfirmActions');

        [
            ['create', 'CREATE', {}],
            ['ok', 'OK', 'url', 'id'],
            ['cancel', 'CANCEL', 'id'],
        ].forEach(([akey, ckey, ...args]) => {
            expect(Actions[akey](...args).type)
                .toEqual(ACTIONS[ckey]);
        });
    });
});
