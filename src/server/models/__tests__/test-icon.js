describe('Icon', () => {
    const { Model } = require('../model');

    const {
        findAll,
    } = Model.prototype;

    jest.dontMock('../icon');
    const { Icon } = require('../icon');

    it('inherits Model', () => {
        expect(Model).toBeCalledWith('icons', 'name', 'ASC');
    });

    it('finds all', () => {
        const result = [
            { id: 'icon1', name: 'icon1.png' },
        ];
        const query = Promise.resolve(result);
        query.select = jest.fn().mockReturnValue(query);
        findAll.mockReturnValue(query);

        return Icon.findAll('user_id', 'user1')
            .then((icons) => {
                expect(query.select).toBeCalled();
                expect(query.select.mock.calls[0]).not.toContain('data');
                expect(icons).toEqual(result);
            });
    });
});
