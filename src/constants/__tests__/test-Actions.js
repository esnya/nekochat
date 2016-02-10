/* eslint max-nested-callbacks: 0, global-require: 0 */

jest.autoMockOff();

describe('Action Constants', () => {
    it('should be unique values', () => {
        const actions = [
            require('../CharacterActions.js'),
            require('../ConfirmActions.js'),
            require('../DialogActions.js'),
            require('../DOMActions.js'),
            require('../IconActions.js'),
            require('../InputActions.js'),
            require('../MessageActions.js'),
            require('../MessageFormActions.js'),
            require('../RoomActions.js'),
            require('../RouteActions.js'),
            require('../SnackActions.js'),
            require('../UserActions.js'),
        ];

        actions.forEach((action) => {
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