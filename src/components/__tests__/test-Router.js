jest.dontMock('react');
describe('Router', () => {
    jest.autoMockOff();
    jest.dontMock('../Router');
    require('../Router');
});
