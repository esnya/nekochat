jest.dontMock('react');
describe('Snack', () => {
    jest.dontMock('../Snack');
    const Snack = require('../Snack').Snack;
});