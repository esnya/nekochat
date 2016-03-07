jest.mock('http');
jest.dontMock('config');
describe('io', () => {
    const io = jest.fn().mockReturnValue({
        use: jest.fn(),
        on: jest.fn(),
    });
    jest.setMock('socket.io', io);
    jest.dontMock('../io');
    require('../io');
});
