describe('color', () => {
    jest.autoMockOff();

    jest.unmock('../color');
    const {makeColor} = require('../color');

    it('makes color', () => {
        expect(makeColor('test1')).toMatch(/^rgb\([0-9]+,[0-9]+,[0-9]+\)$/);
    });

    it('makes unique color', () => {
        expect(makeColor('test1')).toEqual(makeColor('test1'));
        expect(makeColor('test2')).not.toEqual(makeColor('test3'));
    });
});
