const mockServer = {
    listen: jest.genMockFn(),
    address: jest.genMockFn(),
    listeners: jest.genMockFn().mockImpl(() => []),
    removeAllListeners: jest.genMockFn(),
    on: jest.genMockFn(),
};

module.exports = {
    Server: jest.genMockFn().mockReturnValue(mockServer),
    mockServer,
};