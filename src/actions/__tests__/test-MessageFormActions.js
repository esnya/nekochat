describe('MessageFormActions', () => {
    jest.dontMock('../MessageFormActions');
    const ACTIONS = require('../../constants/MessageFormActions');
    const Actions = require('../MessageFormActions');

    it('should be return type', () => {
        [
            ['create', 'CREATE', {}],
            ['update', 'UPDATE', {}],
            ['remove', 'REMOVE', 'id'],
            ['whisperTo', 'WHISPER_TO', 'to'],
            ['appendFile', 'APPEND_FILE', 'id', 'name.png', {}],
        ].forEach(([akey, ckey, ...args]) => {
            expect(Actions[akey](...args).type)
                .toEqual(ACTIONS[ckey]);
        });
    });
});
