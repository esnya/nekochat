jest.dontMock('react');
describe('Router', () => {
    jest.autoMockOff();

    jest.setMock('../../browser/config', {});

    jest.dontMock('../Router');
    require('../Router');
});
