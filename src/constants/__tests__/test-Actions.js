describe('Action Constants', () => {
    it('should be unique values', () => {
        const fs = require('fs');
        const path = require('path');

        const actions = fs
            .readdirSync(path.join(__dirname, '../'))
            .map((p) => path.basename(p))
            .map((p) => p.match(/^(.*)\.js$/))
            .filter((m) => m)
            .map((m) => `../${m[1]}`);

        actions.forEach((p) => jest.dontMock(p));

        actions.forEach((p) => {
            const action = require(p);

            const table = {};

            Object.keys(action)
                .map((key) => action[key])
                .forEach((value) => {
                    table[value] = (table[value] || 0) + 1;
                });

            Object.keys(table)
                .forEach((key) => {
                    expect(table[key]).toBe(1);
                });
        });
    });
});