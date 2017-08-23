jest.dontMock('react');
describe('MessageIcons', () => {
    jest.dontMock('./MessageIcon');
    it('can be required', () => { require('./MessageIcon'); });
});
