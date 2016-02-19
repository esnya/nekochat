jest.dontMock('react');
describe('MessageConfigDialog', () => {
    jest.dontMock('../MessageConfigDialog');
    const MessageConfigDialog =
        require('../MessageConfigDialog').MessageConfigDialog;
});