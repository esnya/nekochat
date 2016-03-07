const io = module.exports = jest.genMockFromModule('socket.io-client');

const mockSocket = module.exports.mockSocket = {
    on: jest.genMockFn(),
};

io.connect.mockReturnValue(mockSocket);
