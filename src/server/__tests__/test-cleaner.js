describe('server', () => {
    describe('cleaner', () => {
        jest.unmock('../cleaner');
        it('can be required', () => { require('../cleaner'); });
    });
});
