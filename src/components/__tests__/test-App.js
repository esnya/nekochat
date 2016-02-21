jest.dontMock('react');
describe('App', () => {
    jest.dontMock('../App');
    require('../App');
});