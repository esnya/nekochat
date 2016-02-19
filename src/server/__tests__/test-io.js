jest.mock('http');
jest.dontMock('config');
describe('io', () => {
    jest.dontMock('../io');
    require('../io');
});