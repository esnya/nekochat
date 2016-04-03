describe('session', () => {
    jest.setMock('config', {
        get: jest.fn((path) => ({
            'session.store': 'database',
        }[path])),
    });

    jest.unmock('../session');
    require('../session');
});
