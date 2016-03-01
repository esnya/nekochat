/* eslint global-require: 0 */

jest.autoMockOff();

describe('DialogReducer', () => {
    const {
        open,
        close,
    } = require('../../actions/DialogActions');
    const {
        dialog,
    } = require('../DialogReducer');

    let state;
    it('should be array', () => {
        state = dialog(undefined, { type: 'TEST_INIT' });
        expect(state).toEqual([]);
    });

    it('should be able to create dialog', () => {
        state = dialog(state, open('dialog-test-1'));
        expect(state.length).toBe(1);
        expect(state[0].id).toEqual('dialog-test-1');

        state = dialog(state, open('dialog-test-2', 'test-data'));
        expect(state.length).toBe(2);
        expect(state[0].id).toEqual('dialog-test-2');
        expect(state[0].data).toEqual('test-data');
    });

    it('should be able to close', () => {
        state = dialog(state, close('dialog-test-2'));
        expect(state.length).toBe(1);
        expect(state[0].id).toEqual('dialog-test-1');

        state = dialog(state, close('dialog-test-1'));
        expect(state.length).toBe(0);
    });
});
