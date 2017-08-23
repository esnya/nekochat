jest.dontMock('react');
describe('Timestamp', () => {
    jest.dontMock('./Timestamp');
    it('can be required', () => { require('./Timestamp'); });
});
