
exports.up = (knex) => knex.schema.table('rooms', (table) => {
    table.renameColumn('notes', 'memo');
});

exports.down = (knex) => knex.schema.table('rooms', (table) => {
    table.renameColumn('memo', 'notes');
});
