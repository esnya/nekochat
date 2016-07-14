describe('id', () => {
    jest.unmock('../id');
    const { generateId } = require('../id');

    it('generates id', () => {
        expect(generateId('test')).toMatch(/^[0-9a-f]+$/);
    });

    it('generates unique id', () => {
        expect(generateId('test1')).toEqual(generateId('test1'));
        expect(generateId('test2')).not.toEqual(generateId('test3'));
    });

    it('generates unique id without data', () => {
        expect(generateId()).not.toEqual(generateId());
    });
});
