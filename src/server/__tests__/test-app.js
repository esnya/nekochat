describe('app', () => {
    jest.dontMock('../app');
    jest.setMock('config', {
        get: jest.fn((path) => ({
            'session.store': 'database',
            redis: {},
        }[path])),
    });

    it('can be required', () => { require('../app'); });
});
