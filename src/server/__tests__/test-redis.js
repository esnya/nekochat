describe('redis', () => {
    jest.unmock('../redis');
    it('can be required', () => { require('../redis'); });
});
