jest.dontMock('react');
describe('RoomListItem', () => {
    jest.autoMockOff();
    jest.dontMock('./RoomListItem');
    it('can be required', () => { require('./RoomListItem'); });
});
