describe('User', () => {
    const {Model} = require('../model');

    jest.dontMock('../user');
    require('../user');

    it('inherits Model', () => {
        expect(Model).toBeCalledWith('users');
    });
});
