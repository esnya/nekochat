describe('RoomMiddleware', () => {
    jest.autoMockOff();

    const Dialog = require('../../actions/DialogActions');
    const Room = require('../../actions/RoomActions');

    const room = require('../RoomMiddleware').room;

    it('opens password dialog', () => {
        const dispatch = jest.genMockFn();
        const next = jest.genMockFn();

        room({ dispatch })(next)(Room.password('room-id-1'));

        expect(dispatch)
            .toBeCalledWith(Dialog.open('room-password', 'room-id-1'));
        expect(next).toBeCalledWith(Room.password('room-id-1'));
    });
});
