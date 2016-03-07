describe('CharacterActions', () => {
    it('should be return type', () => {
        jest.dontMock('../CharacterActions');
        const CHARACTER = require('../../constants/CharacterActions');
        const Character = require('../CharacterActions');

        [
            ['get', 'GET', 'url'],
            ['set', 'SET', 'url', {}],
            ['remove', 'REMOVE', 'url'],
        ].forEach(([akey, ckey, ...args]) => {
            expect(Character[akey](...args).type)
                .toEqual(CHARACTER[ckey]);
        });
    });
});
