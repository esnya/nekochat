jest.dontMock('react');
describe('App', () => {
    jest.autoMockOff();
    jest.dontMock('../App');
    require('../App');
});
