jest.dontMock('react');
describe('MessageListItem', () => {
    jest.autoMockOff();
    jest.dontMock('../MessageListItem');
    require('../MessageListItem');
});
