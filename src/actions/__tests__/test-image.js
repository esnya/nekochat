describe('image', () => {
    jest.unmock('../image');
    const Image = require('../image');

    it('exposes action creators', () => {
        expect(Image.upload('foo.png', {}).type).toEqual(Image.UPLOAD);
    });
});
