jest.dontMock('react');
describe('App', () => {
    jest.autoMockOff();

    jest.setMock('../browser/config', {});

    jest.dontMock('./App');
    it('can be required', () => { require('./App'); });
});
