describe('app', () => {
    jest.dontMock('../app');
    jest.setMock('config', {
        get: jest.fn((path) => ({
            'session.store': 'database',
        }[path])),
    });

    require('../app');
});
