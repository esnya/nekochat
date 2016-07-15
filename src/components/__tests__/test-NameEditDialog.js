jest.dontMock('react');
describe('NameEditDialog', () => {
    jest.autoMockOff();
    jest.dontMock('../NameEditDialog');
    it('can be required', () => { require('../NameEditDialog'); });
});
