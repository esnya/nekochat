jest.dontMock('config');
describe('app', () => {
    jest.dontMock('../app');
    require('../app');
});
