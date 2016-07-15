jest.dontMock('react');
describe('Router', () => {
    jest.autoMockOff();

    jest.setMock('../../browser/config', {});

    jest.dontMock('../Router');
    it('can be required', () => { require('../Router'); });
});
