/* eslint global-require: 0 */

jest.autoMockOff();

describe('ConfirmListReducer', () => {
    const {
        create,
        ok,
        cancel,
    } = require('../../actions/ConfirmActions');
    const {
        confirmList,
    } = require('../ConfirmListReducer');

    let state;
    it('should be array', () => {
        state = confirmList(undefined, { type: 'TEST_INIT' });
        expect(state).toEqual([]);
    });

    it('should be able to create confirm', () => {
        state = confirmList(state, create({
            message: 'Test confirm1',
        }));
        expect(state.length).toBe(1);
        expect(state[0].id).toBeDefined();
        expect(state[0].message).toEqual('Test confirm1');

        state = confirmList(state, create({
            message: 'Test confirm2',
        }));
        expect(state.length).toBe(2);
        expect(state[1].id).toBeDefined();
        expect(state[1].id).not.toEqual(state[0].id);
        expect(state[1].message).toEqual('Test confirm2');
    });

    it('should be able to ok/cancel', () => {
        const id = state[0].id;
        state = confirmList(state, ok(id));
        expect(state.length).toBe(1);
        expect(state[0].id).not.toBe(id);

        state = confirmList(state, cancel(state[0].id));
        expect(state.length).toBe(0);
    });
});
