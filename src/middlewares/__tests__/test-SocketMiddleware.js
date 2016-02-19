jest.dontMock('redux');
describe('SocketMiddleware', () => {
    jest.dontMock('../SocketMiddleware');
    const SocketMiddleware = require('../SocketMiddleware');
});