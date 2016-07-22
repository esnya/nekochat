describe('components', () => {
    describe('LiteTextField', () => {
        jest.unmock('react');
        jest.unmock('../LiteTextField');
        it('can be required', () => {
            require('../LiteTextField');
        });
    });
});
