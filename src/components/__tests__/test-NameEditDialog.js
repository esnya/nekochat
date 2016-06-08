jest.dontMock('react');
describe('NameEditDialog', () => {
    jest.autoMockOff();
    jest.dontMock('../NameEditDialog');
    require('../NameEditDialog');
});
