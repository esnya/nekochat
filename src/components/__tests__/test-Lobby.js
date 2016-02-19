jest.dontMock('react');
describe('Lobby', () => {
    jest.dontMock('../Lobby');
    const Lobby = require('../Lobby').Lobby;
});