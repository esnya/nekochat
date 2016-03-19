describe('User', () => {
    const {Model} = require('../model');

    jest.dontMock('../user');
    const {User} = require('../user');

    it('inherits Model', () => {
        expect(Model).toBeCalledWith('users');
    });
});
