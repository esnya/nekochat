describe('session', () => {
    jest.setMock('config', {
        get: jest.fn(path => ({
            'session.store': 'database',
            redis: {},
        }[path])),
    });

    jest.unmock('./session');
    it('can be required', () => { require('./session'); });
});
