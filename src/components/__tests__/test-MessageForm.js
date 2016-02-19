jest.dontMock('react');
describe('MessageForm', () => {
    jest.dontMock('../MessageForm');
    const MessageForm = require('../MessageForm').MessageForm;
});