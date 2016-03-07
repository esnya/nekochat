jest.mock('http');
jest.dontMock('config');
describe('server', () => {
    jest.dontMock('../server');
    require('../server');
});
