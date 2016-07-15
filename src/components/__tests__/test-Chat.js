describe('Chat', () => {
    jest.autoMockOff();

    jest.setMock('../../browser/config', {});

    jest.unmock('react');
    jest.unmock('../Chat');
    it('can be required', () => { require('../Chat'); });
});
