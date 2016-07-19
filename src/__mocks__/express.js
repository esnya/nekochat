const mockApp = {
    use: jest.genMockFn(),
    set: jest.genMockFn(),
    get: jest.genMockFn(),
    post: jest.genMockFn(),
};

const express = jest.genMockFn().mockReturnValue(mockApp);
express.static = jest.genMockFn();
express.mockApp = mockApp;

express.Router = jest.fn();
express.Router.prototype = {
    use: jest.genMockFn(),
    set: jest.genMockFn(),
    get: jest.genMockFn(),
    post: jest.genMockFn(),
};

module.exports = express;

