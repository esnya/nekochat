describe('Chat', () => {
    jest.autoMockOff();
    jest.unmock('react');
    jest.unmock('../Chat');
    require('../Chat');
});
