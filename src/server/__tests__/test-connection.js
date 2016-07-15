describe('connection', () => {
    jest.unmock('../connection');
    it('can be required', () => { require('../connection'); });
});
