describe('socket', () => {
    jest.autoMockOff();

    const socket = {
        on: jest.fn(),
    };

    jest.setMock('../../browser/user', {
        id: 'user',
        name: 'User',
    });
    jest.setMock('socket.io-client', {
        connect: jest.fn().mockReturnValue(socket),
    });

    window.localStorage = {
        getItem: jest.fn(),
    };

    jest.unmock('redux');
    jest.unmock('../socket');
    require('../socket');
});
