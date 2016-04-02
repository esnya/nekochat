describe('server', () => {
    jest.mock('http');
    jest.unmock('config');
    require('config');

    jest.unmock('../server');
    require('../server');
});
