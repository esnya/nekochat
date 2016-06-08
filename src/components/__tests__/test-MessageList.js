jest.dontMock('react');
describe('MessageList', () => {
    jest.autoMockOff();
    jest.dontMock('../MessageList');
    require('../MessageList');
});
