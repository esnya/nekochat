const mockApp = {
    use: jest.genMockFn(),
    set: jest.genMockFn(),
    get: jest.genMockFn(),
    post: jest.genMockFn(),
};

const express = jest.genMockFn().mockReturnValue(mockApp);
express.static = jest.genMockFn();
express.mockApp = mockApp;

module.exports = express;
