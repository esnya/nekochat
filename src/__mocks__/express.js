const mockApp = {
    use: jest.fn(),
    set: jest.fn(),
    get: jest.fn(),
    post: jest.fn(),
};

const express = jest.fn().mockReturnValue(mockApp);
express.static = jest.fn();
express.mockApp = mockApp;

express.Router = jest.fn();
express.Router.prototype = {
    use: jest.fn(),
    set: jest.fn(),
    get: jest.fn(),
    post: jest.fn(),
};

module.exports = express;

