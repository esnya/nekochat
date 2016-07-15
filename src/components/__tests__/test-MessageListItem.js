jest.dontMock('react');
describe('MessageListItem', () => {
    jest.autoMockOff();
    jest.dontMock('../MessageListItem');
    it('can be required', () => { require('../MessageListItem'); });
});
