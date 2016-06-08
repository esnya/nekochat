describe('router', () => {
    jest.autoMockOff();
    jest.dontMock('redux');
    jest.dontMock('../router');

    jest.setMock('../../browser/user', {
        id: 'user',
        name: 'User',
    });

    window.localStorage = {
        getItem: jest.fn(),
    };

    require('../router');
});
