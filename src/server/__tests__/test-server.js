describe('server', () => {
    jest.mock('http');
    jest.setMock('config', {
        get: jest.fn((path) => ({
            'session.store': 'database',
        }[path])),
    });

    jest.unmock('../server');
    require('../server');
});
