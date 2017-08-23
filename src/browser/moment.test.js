describe('moment', () => {
    jest.dontMock('./moment');
    it('can be required', () => { require('./moment'); });
});
