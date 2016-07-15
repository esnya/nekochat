describe('config', () => {
    jest.setMock('../localStorage', { getItem: jest.fn() });

    jest.unmock('../config');
    it('can be required', () => { require('../config'); });
});
