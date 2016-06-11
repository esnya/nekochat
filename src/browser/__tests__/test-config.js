describe('config', () => {
    jest.setMock('../localStorage', { getItem: jest.fn() });

    jest.unmock('../config');
    require('../config');
});
