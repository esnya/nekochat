describe('User', () => {
    const ColumnBuilder = require('knex/lib/schema/columnbuilder');
    const TableBuilder = require('knex/lib/schema/tablebuilder');
    const {Model} = require('../model');

    jest.dontMock('../user');
    const {User} = require('../user');

    it('inherits Model', () => {
        expect(Model).toBeCalledWith('users');
    });

    it('creates table', () => {
        User.fn = {
            now: jest.fn(),
        };

        const column = new ColumnBuilder();
        const builder = new TableBuilder();

        [
            'notNullable',
        ].forEach((key) => {
            column[key].mockReturnValue(column);
        });
        [
            'string',
            'timestamp',
        ].forEach((key) => {
            builder[key].mockReturnValue(column);
        });

        User.create(builder);
    });
});
