jest.dontMock('react');
describe('Chat', () => {
    jest.dontMock('../Chat');
    require('../Chat');
});