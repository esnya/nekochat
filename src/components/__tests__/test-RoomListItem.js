jest.dontMock('react');
describe('RoomListItem', () => {
    jest.autoMockOff();
    jest.dontMock('../RoomListItem');
    require('../RoomListItem');
});
