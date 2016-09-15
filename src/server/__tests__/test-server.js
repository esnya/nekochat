describe('server', () => {
    jest.mock('http');
    jest.setMock('config', {
        get: jest.fn((path) => ({
            'session.store': 'database',
            redis: {},
        }[path])),
    });

    jest.unmock('../server');
    it('can be required', () => { require('../server'); });
});
