describe('session', () => {
    jest.unmock('config');
    require('config');

    jest.unmock('../session');
    require('../session');
});
