describe('io', () => {
    jest.mock('http');
    jest.setMock('config', {
        get: jest.fn(path => ({
            'session.store': 'database',
        }[path] || {})),
    });
    const io = jest.fn();
    io.prototype = {
        use: jest.fn(),
        on: jest.fn(),
    };
    jest.setMock('socket.io', io);
    jest.unmock('../io');
    it('can be required', () => { require('../io'); });
});
