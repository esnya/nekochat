describe('File', () => {
    jest.unmock('color-convert');

    const ColumnBuilder = require('knex/lib/schema/columnbuilder');
    const TableBuilder = require('knex/lib/schema/tablebuilder');
    const {Model} = require('../model');

    jest.dontMock('../file');
    const {File} = require('../file');

    it('inherits Model', () => {
        expect(Model).toBeCalledWith('files');
    });

    it('creates table', () => {
        File.fn = {
            now: jest.fn(),
        };

        const column = new ColumnBuilder();
        const builder = new TableBuilder();

        [
            'notNullable',
            'nullable',
        ].forEach((key) => {
            column[key].mockReturnValue(column);
        });
        column.references.mockReturnValue({
            inTable: jest.fn(),
        });
        [
            'binary',
            'enum',
            'increments',
            'string',
            'text',
            'timestamp',
        ].forEach((key) => {
            builder[key].mockReturnValue(column);
        });

        File.create(builder);
    });
});
