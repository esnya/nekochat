describe('File', () => {
    const { Model } = require('../model');

    jest.dontMock('../file');
    require('../file');

    it('inherits Model', () => {
        expect(Model).toBeCalledWith('files');
    });
});
