const mockServer = jest.fn();
mockServer.prototype = {
    listen: jest.fn(),
    address: jest.fn(),
    listeners: jest.fn().mockImplementation(() => []),
    removeAllListeners: jest.fn(),
    on: jest.fn(),
};

module.exports = {
    Server: mockServer,
};
