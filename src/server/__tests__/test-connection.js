describe('connection', () => {
    jest.setMock('config', {
        get: jest.fn(path => ({
            redis: {},
        }[path])),
    });
    jest.unmock('../connection');
    it('can be required', () => { require('../connection'); });
});
