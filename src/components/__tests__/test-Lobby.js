jest.dontMock('react');
describe('Lobby', () => {
    jest.autoMockOff();

    jest.setMock('../../browser/config', {});

    jest.dontMock('../Lobby');
    it('can be required', () => { require('../Lobby'); });
});
