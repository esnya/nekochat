describe('Icon', () => {
    const {Model} = require('../model');

    jest.dontMock('../icon');
    require('../icon');

    it('inherits Model', () => {
        expect(Model).toBeCalledWith('icons');
    });
});
