jest.dontMock('react');
describe('MessageList', () => {
    jest.autoMockOff();
    jest.dontMock('../MessageList');
    it('can be required', () => { require('../MessageList'); });
});
