jest.dontMock('react');
describe('Chat', () => {
    jest.dontMock('../Chat');
    const Chat = require('../Chat').Chat;
});