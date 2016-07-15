describe('knex', () => {
    jest.dontMock('../knex');
    it('can be required', () => { require('../knex'); });
});
