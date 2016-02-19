jest.dontMock('config');
describe('session', () => {
    jest.dontMock('../session');
    require('../session');
});