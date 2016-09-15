describe('handlers/room', () => {
    jest.setMock('config', {
        get: jest.fn((path) => ({
            redis: {},
        }[path])),
    });

    jest.unmock('../room');
    it('can be required', () => { require('../room'); });
});
