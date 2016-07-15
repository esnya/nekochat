describe('middlewares', () => {
    describe('router', () => {
        jest.unmock('../router');
        it('can be required', () => { require('../router'); });
    });
});
