describe('Icon', () => {
    jest.unmock('color-convert');

    const ColumnBuilder = require('knex/lib/schema/columnbuilder');
    const TableBuilder = require('knex/lib/schema/tablebuilder');
    const {Model} = require('../model');

    const {
        findAll,
    } = Model.prototype;

    jest.dontMock('../icon');
    const {Icon} = require('../icon');

    it('inherits Model', () => {
        expect(Model).toBeCalledWith('icons');
    });

    pit('finds all', () => {
        const result = [
            {id: 'icon1', name: 'icon1.png'},
        ];
        const query = Promise.resolve(result);
        query.select = jest.fn().mockReturnValue(query);
        findAll.mockReturnValue(query);

        return Icon.findAll('user_id', 'user1')
            .then((icons) => {
                expect(query.select).toBeCalled();
                expect(query.select.mock.calls[0]).not.toContain('data');
                expect(icons).toEqual(result);
            });
    });

    it('creates table', () => {
        Icon.fn = {
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

        Icon.create(builder);
    });
});
