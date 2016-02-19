jest.dontMock('react');
describe('MessageList', () => {
    jest.dontMock('../MessageList');
    const MessageList = require('../MessageList').MessageList;
});