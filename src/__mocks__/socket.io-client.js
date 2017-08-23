const io = module.exports = jest.genMockFromModule('socket.io-client');

const mockSocket = module.exports.mockSocket = {
    on: jest.fn(),
};

io.connect.mockReturnValue(mockSocket);
