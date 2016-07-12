describe('server', () => {
    describe('cleaner', () => {
        jest.unmock('../cleaner');
        require('../cleaner');
    });
});
