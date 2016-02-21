jest.dontMock('redux');
describe('SocketMiddleware', () => {
    jest.dontMock('../SocketMiddleware');
    require('../SocketMiddleware');
});