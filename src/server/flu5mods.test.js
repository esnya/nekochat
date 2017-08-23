describe('server', () => {
    describe('flu5mods', () => {
        it('can be required', () => {
            jest.autoMockOff();
            jest.unmock('./flu5mods');
            require('./flu5mods');
        });
    });
});
