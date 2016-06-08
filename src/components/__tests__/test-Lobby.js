jest.dontMock('react');
describe('Lobby', () => {
    jest.autoMockOff();
    jest.dontMock('../Lobby');
    require('../Lobby');
});
