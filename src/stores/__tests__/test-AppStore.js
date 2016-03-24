describe('AppStore', () => {
    jest.autoMockOff();
    const {AppStore} = require('../AppStore');

    it('is store', () => {
        const state = AppStore.getState();

        expect(typeof(state.characters)).toEqual('object');
        expect(Array.isArray(state.characters)).toBe(false);
        expect(Array.isArray(state.confirmList)).toBe(true);
        expect(Array.isArray(state.dialog)).toBe(true);
        expect(typeof(state.dom)).toEqual('object');
        expect(Array.isArray(state.dom)).toBe(false);
        expect(Array.isArray(state.iconList)).toBe(true);
        expect(Array.isArray(state.messageForm)).toBe(true);
        expect(Array.isArray(state.messageList)).toBe(true);
        expect(Array.isArray(state.notifications)).toBe(true);
        expect(Array.isArray(state.roomList)).toBe(true);
        expect(typeof(state.room)).toEqual('object');
        expect(Array.isArray(state.room)).toBe(false);
        expect(typeof(state.route)).toEqual('object');
        expect(Array.isArray(state.route)).toBe(false);
        expect(typeof(state.user)).toEqual('object');
        expect(Array.isArray(state.user)).toBe(false);
        expect(Array.isArray(state.users)).toBe(true);
    });
});
