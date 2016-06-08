describe('actions', () => {
    jest.autoMockOff();

    const { readdirSync } = require('fs');
    const { join } = require('path');

    const createAction = jest.fn(() => (type) => ({type}));
    jest.setMock('redux-actions', { createAction });

    readdirSync(join(__dirname, '..'))
        .map((file) => file.match(/^(.*)\.js$/))
        .filter((m) => m)
        .map((m) => m[1])
        .forEach((file) => {
            describe(file, () => {
                const path = join('..', file);
                jest.unmock(path);
                const actions = require(path);

                it('contains action types', () => {
                    Object.keys(actions)
                        .filter((key) => key.match(/^[A-Z0-9_]+$/))
                        .map((key) => actions[key])
                        .forEach((type) => {
                            expect(typeof(type)).toBe('string');
                        });
                });

                it('contains action creators', () => {
                    Object.keys(actions)
                        .filter((key) => key.match(/^[a-z][A-Z0-9]*$/))
                        .map((key) => actions[key])
                        .forEach((creator) => {
                            expect(typeof(creator)).toBe('function');
                            expect(typeof(creator().type)).toBe('string');
                        });
                });
            });
        });
});
