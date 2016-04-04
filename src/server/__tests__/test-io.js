describe('io', () => {
    jest.mock('http');
    jest.setMock('config', {
        get: jest.fn((path) => ({
            'session.store': 'database',
        }[path] || {})),
    });
    const io = jest.fn().mockReturnValue({
        use: jest.fn(),
        on: jest.fn(),
    });
    jest.setMock('socket.io', io);
    jest.unmock('../io');
    require('../io');
});
