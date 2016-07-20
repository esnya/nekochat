describe('browser', () => {
    describe('routes', () => {
        it('can be required', () => {
            jest.autoMockOff();
            jest.unmock('../routes');
            require('../routes');
        });
    });
});
