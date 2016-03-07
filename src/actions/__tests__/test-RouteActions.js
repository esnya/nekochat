describe('RouteActions', () => {
    jest.dontMock('../RouteActions');
    const ACTIONS = require('../../constants/RouteActions');
    const Actions = require('../RouteActions');

    it('should be return type', () => {
        [
            ['set', 'SET', 'path'],
        ].forEach(([akey, ckey, ...args]) => {
            expect(Actions[akey](...args).type)
                .toEqual(ACTIONS[ckey]);
        });
    });
});
