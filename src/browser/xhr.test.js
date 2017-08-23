describe('xhr', () => {
    jest.dontMock('./xhr');
    it('can be required', () => { require('./xhr'); });
});
